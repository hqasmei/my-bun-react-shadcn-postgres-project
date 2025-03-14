import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  ingredients: text("ingredients").notNull(),
  instructions: text("instructions").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});
