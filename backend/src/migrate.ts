import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

// Connect to database with a single connection
const sql = postgres(process.env.DATABASE_URL!, { max: 1 });
const db = drizzle(sql);

// Run migrations
console.log("Running migrations...");
migrate(db, { migrationsFolder: "drizzle" })
  .then(() => {
    console.log("Migrations completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exit(1);
  });
