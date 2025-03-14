import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const groceryItems = pgTable("grocery_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
