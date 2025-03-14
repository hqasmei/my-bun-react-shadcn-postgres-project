import { Hono } from "hono";
import { cors } from "hono/cors";
import { drizzle } from "drizzle-orm/postgres-js";
import { eq } from "drizzle-orm";
import postgres from "postgres";
import { groceryItems } from "./schema";

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
  return c.json({ message: "Grocery API is running!" });
});

// Get all grocery items
app.get("/api/grocery", async (c) => {
  try {
    const items = await db.select().from(groceryItems);
    return c.json({ items });
  } catch (error) {
    console.error("Error fetching grocery items:", error);
    return c.json({ error: "Failed to fetch grocery items" }, 500);
  }
});

// Get a single grocery item by ID
app.get("/api/grocery/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid ID format" }, 400);
  }

  try {
    const item = await db
      .select()
      .from(groceryItems)
      .where(eq(groceryItems.id, id))
      .limit(1);

    if (item.length === 0) {
      return c.json({ error: "Grocery item not found" }, 404);
    }

    return c.json({ item: item[0] });
  } catch (error) {
    console.error("Error fetching grocery item:", error);
    return c.json({ error: "Failed to fetch grocery item" }, 500);
  }
});

// Create a new grocery item
app.post("/api/grocery", async (c) => {
  try {
    const body = await c.req.json();

    // Validate input
    if (!body.name || typeof body.name !== "string") {
      return c.json({ error: "Name is required and must be a string" }, 400);
    }

    // Insert into database
    const newItem = await db
      .insert(groceryItems)
      .values({
        name: body.name,
      })
      .returning();

    return c.json({ item: newItem[0] }, 201);
  } catch (error) {
    console.error("Error creating grocery item:", error);
    return c.json({ error: "Failed to create grocery item" }, 500);
  }
});

// Update a grocery item
app.put("/api/grocery/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid ID format" }, 400);
  }

  try {
    const body = await c.req.json();

    // Validate input
    if (!body.name || typeof body.name !== "string") {
      return c.json({ error: "Name is required and must be a string" }, 400);
    }

    const updatedItem = await db
      .update(groceryItems)
      .set({ name: body.name })
      .where(eq(groceryItems.id, id))
      .returning();

    if (updatedItem.length === 0) {
      return c.json({ error: "Grocery item not found" }, 404);
    }

    return c.json({ item: updatedItem[0] });
  } catch (error) {
    console.error("Error updating grocery item:", error);
    return c.json({ error: "Failed to update grocery item" }, 500);
  }
});

// Delete a grocery item
app.delete("/api/grocery/:id", async (c) => {
  const id = Number(c.req.param("id"));

  if (isNaN(id)) {
    return c.json({ error: "Invalid ID format" }, 400);
  }

  try {
    const deletedItem = await db
      .delete(groceryItems)
      .where(eq(groceryItems.id, id))
      .returning();

    if (deletedItem.length === 0) {
      return c.json({ error: "Grocery item not found" }, 404);
    }

    return c.json({ success: true, item: deletedItem[0] });
  } catch (error) {
    console.error("Error deleting grocery item:", error);
    return c.json({ error: "Failed to delete grocery item" }, 500);
  }
});

// Start the server
const port = process.env.PORT || 3001;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
