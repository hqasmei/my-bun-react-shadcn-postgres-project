# Recipe Management API Backend

This backend provides a RESTful API for managing recipes using Hono, Drizzle ORM, and PostgreSQL.

## Getting Started

To install dependencies:

```bash
bun install
```

To run the development server:

```bash
bun run index.ts
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM. Make sure you have PostgreSQL running and set the `DATABASE_URL` environment variable.

### Database Migration Commands

```bash
# Generate migration files based on your schema
bun drizzle-kit generate

# Apply migrations to your database
bun drizzle-kit migrate

# Push schema changes directly to the database
bun drizzle-kit push

# Pull the current database schema
bun drizzle-kit pull

# Check for differences between schema and database
bun drizzle-kit check

# Apply pending migrations
bun drizzle-kit up

# Launch Drizzle Studio to manage your database
bun drizzle-kit studio
```

## API Endpoints

### Recipes

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get a specific recipe by ID
- `POST /api/recipes` - Create a new recipe
  - Required fields: `title`, `ingredients`, `instructions`
- `PUT /api/recipes/:id` - Update a recipe
  - At least one of: `title`, `ingredients`, `instructions`
- `DELETE /api/recipes/:id` - Delete a recipe

## Technologies

- [Bun](https://bun.sh) - JavaScript runtime and package manager
- [Hono](https://hono.dev) - Fast, lightweight web framework
- [Drizzle ORM](https://orm.drizzle.team) - TypeScript ORM for SQL databases
- [PostgreSQL](https://www.postgresql.org) - Open source relational database