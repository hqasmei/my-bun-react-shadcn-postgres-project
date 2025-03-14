import { Hono } from "hono";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { recipes } from "./schema";

// Create a PostgreSQL connection
const sql = postgres(process.env.DATABASE_URL!);
// Initialize drizzle
const db = drizzle(sql);

// Create Hono app
const app = new Hono();

// Add CORS middleware to allow requests from your frontend
app.use(
  "/*",
  cors({
    origin: ["http://localhost:3000"], // Add your frontend URL
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

// Add a health check endpoint
app.get("/", (c) => {
  return c.json({ message: "Recipe API is running!" });
});

// Get all recipes
app.get("/api/recipes", async (c) => {
  try {
    const items = await db.select().from(recipes);
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
    const item = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id))
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
    const body = await c.req.json();

    // Validate input
    if (!body.title || typeof body.title !== "string") {
      return c.json({ error: "Title is required and must be a string" }, 400);
    }
    
    if (!body.ingredients || typeof body.ingredients !== "string") {
      return c.json({ error: "Ingredients are required and must be a string" }, 400);
    }
    
    if (!body.instructions || typeof body.instructions !== "string") {
      return c.json({ error: "Instructions are required and must be a string" }, 400);
    }

    // Insert into database
    const newRecipe = await db
      .insert(recipes)
      .values({
        title: body.title,
        ingredients: body.ingredients,
        instructions: body.instructions,
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
    const body = await c.req.json();

    // Validate input
    if ((!body.title && !body.ingredients && !body.instructions) || 
        (body.title && typeof body.title !== "string") ||
        (body.ingredients && typeof body.ingredients !== "string") ||
        (body.instructions && typeof body.instructions !== "string")) {
      return c.json({ error: "At least one valid field (title, ingredients, or instructions) is required" }, 400);
    }

    // Build update object with only provided fields
    const updateData: any = {};
    if (body.title) updateData.title = body.title;
    if (body.ingredients) updateData.ingredients = body.ingredients;
    if (body.instructions) updateData.instructions = body.instructions;

    const updatedRecipe = await db
      .update(recipes)
      .set(updateData)
      .where(eq(recipes.id, id))
      .returning();

    if (updatedRecipe.length === 0) {
      return c.json({ error: "Recipe not found" }, 404);
    }

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
    const deletedRecipe = await db
      .delete(recipes)
      .where(eq(recipes.id, id))
      .returning();

    if (deletedRecipe.length === 0) {
      return c.json({ error: "Recipe not found" }, 404);
    }

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
