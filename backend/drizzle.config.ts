import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: "localhost",
    port: 5432,
    database: "yourdbname", // replace with your database name
    user: "postgres", // replace with your database user
    password: "postgres", // replace with your database password
  },
});
