import { Hono } from "hono";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq, and } from "drizzle-orm";
import postgres from "postgres";
import { recipes } from "./schema";
import { auth } from "./auth"; // Import the auth configuration

// Create a PostgreSQL connection
const sql = postgres(process.env.DATABASE_URL!);
// Initialize drizzle
const db = drizzle(sql);

// Create Hono app with session type definitions
const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

// Add CORS middleware with more permissive settings
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000"], // Your frontend URL
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization", "Cookie", "Set-Cookie", "*"],
    exposeHeaders: ["Content-Length", "Set-Cookie", "*"],
    maxAge: 600,
    credentials: true,
  })
);

// Add auth session middleware
app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

// Mount the Better Auth handler (only once!) 
app.on(["GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"], "/api/auth/*", (c) => {
  console.log("Auth request:", c.req.method, c.req.path, {
    headers: Object.fromEntries(c.req.raw.headers.entries()),
    url: c.req.url,
  });
  return auth.handler(c.req.raw);
});

// Get session info
app.get("/api/session", async (c) => {
  const session = c.get("session");
  const user = c.get("user");

  if (!user) return c.json({ error: "Unauthorized" }, 401);

  return c.json({
    session,
    user,
  });
});

// Get all recipes
app.get("/api/recipes", async (c) => {
  try {
    const user = c.get("user");
    
    // Check if user is authenticated
    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }
    
    // Return only the authenticated user's recipes
    const items = await db.select().from(recipes).where(eq(recipes.userId, user.id));
    return c.json({ recipes: items });
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return c.json({ error: "Failed to fetch recipes" }, 500);
  }
});

// Get a single recipe by ID
app.get("/api/recipes/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid ID format" }, 400);
  }

  try {
    const user = c.get("user");
    
    // Check if user is authenticated
    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }
    
    const item = await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.id, id), eq(recipes.userId, user.id)))
      .limit(1);

    if (item.length === 0) {
      return c.json({ error: "Recipe not found" }, 404);
    }

    return c.json({ recipe: item[0] });
  } catch (error) {
    console.error("Error fetching recipe:", error);
    return c.json({ error: "Failed to fetch recipe" }, 500);
  }
});

// Create a new recipe
app.post("/api/recipes", async (c) => {
  try {
    const user = c.get("user");
    
    // Check if user is authenticated
    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }
    
    const body = await c.req.json();

    // Validate input
    if (!body.title || typeof body.title !== "string") {
      return c.json({ error: "Title is required and must be a string" }, 400);
    }

    if (!body.ingredients || typeof body.ingredients !== "string") {
      return c.json(
        { error: "Ingredients are required and must be a string" },
        400
      );
    }

    if (!body.instructions || typeof body.instructions !== "string") {
      return c.json(
        { error: "Instructions are required and must be a string" },
        400
      );
    }

    // Validate optional fields if provided
    if (body.website_url && typeof body.website_url !== "string") {
      return c.json({ error: "Website URL must be a string" }, 400);
    }

    if (body.image_url && typeof body.image_url !== "string") {
      return c.json({ error: "Image URL must be a string" }, 400);
    }

    // Insert into database with user ID
    const newRecipe = await db
      .insert(recipes)
      .values({
        title: body.title,
        ingredients: body.ingredients,
        instructions: body.instructions,
        website_url: body.website_url || null,
        image_url: body.image_url || null,
        userId: user.id, // Associate recipe with the authenticated user
      })
      .returning();

    return c.json({ recipe: newRecipe[0] }, 201);
  } catch (error) {
    console.error("Error creating recipe:", error);
    return c.json({ error: "Failed to create recipe" }, 500);
  }
});

// Update a recipe
app.put("/api/recipes/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid ID format" }, 400);
  }

  try {
    const user = c.get("user");
    
    // Check if user is authenticated
    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }
    
    // Check if the recipe belongs to the user
    const existingRecipe = await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.id, id), eq(recipes.userId, user.id)))
      .limit(1);
      
    if (existingRecipe.length === 0) {
      return c.json({ error: "Recipe not found or you don't have permission to update it" }, 404);
    }
    
    const body = await c.req.json();

    // Validate input
    if (
      (!body.title &&
        !body.ingredients &&
        !body.instructions &&
        !body.website_url &&
        !body.image_url) ||
      (body.title && typeof body.title !== "string") ||
      (body.ingredients && typeof body.ingredients !== "string") ||
      (body.instructions && typeof body.instructions !== "string") ||
      (body.website_url && typeof body.website_url !== "string") ||
      (body.image_url && typeof body.image_url !== "string")
    ) {
      return c.json(
        {
          error:
            "At least one valid field (title, ingredients, instructions, website_url, or image_url) is required",
        },
        400
      );
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (body.title) updateData.title = body.title;
    if (body.ingredients) updateData.ingredients = body.ingredients;
    if (body.instructions) updateData.instructions = body.instructions;
    if (body.website_url !== undefined)
      updateData.website_url = body.website_url;
    if (body.image_url !== undefined) updateData.image_url = body.image_url;

    // Always update the updated_at timestamp when modifying a recipe
    updateData.updated_at = new Date();

    const updatedRecipe = await db
      .update(recipes)
      .set(updateData)
      .where(eq(recipes.id, id))
      .returning();

    return c.json({ recipe: updatedRecipe[0] });
  } catch (error) {
    console.error("Error updating recipe:", error);
    return c.json({ error: "Failed to update recipe" }, 500);
  }
});

// Delete a recipe
app.delete("/api/recipes/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid ID format" }, 400);
  }

  try {
    const user = c.get("user");
    
    // Check if user is authenticated
    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }
    
    // Check if the recipe belongs to the user
    const existingRecipe = await db
      .select()
      .from(recipes)
      .where(and(eq(recipes.id, id), eq(recipes.userId, user.id)))
      .limit(1);
      
    if (existingRecipe.length === 0) {
      return c.json({ error: "Recipe not found or you don't have permission to delete it" }, 404);
    }

    const deletedRecipe = await db
      .delete(recipes)
      .where(eq(recipes.id, id))
      .returning();

    return c.json({ success: true, recipe: deletedRecipe[0] });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return c.json({ error: "Failed to delete recipe" }, 500);
  }
});

// Start the server
const port = process.env.PORT || 3001;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
