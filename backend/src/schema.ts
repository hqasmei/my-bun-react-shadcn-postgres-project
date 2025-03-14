import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  ingredients: text("ingredients").notNull(),
  instructions: text("instructions").notNull(),
  website_url: text("website_url"),
  image_url: text("image_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
