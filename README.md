# RecipeBudd - A Recipe Management Application

A modern full-stack application built with Bun, React, Shadcn UI, and PostgreSQL.

<div align="center">
  <img src="![RecipeBudd Demo](https://github.com/user-attachments/assets/b5dc8f10-30a0-45e0-aa5e-cf11caec721b)" alt="App">
</div>

## About The Project 📖

This project demonstrates a clean, efficient, and modern approach to full-stack web development. It combines the speed of Bun with the flexibility of React and the reliability of PostgreSQL to create a seamless development experience.

### How It Works

The application follows a clear separation of concerns:

- **Frontend**: A React application built with Vite that handles the user interface and client-side logic. React Router v7 manages navigation between different views, while Shadcn UI provides beautiful, accessible components that speed up development without sacrificing customization.

- **Backend**: A Bun-powered server using Hono as a lightweight, fast web framework. The API endpoints communicate with a PostgreSQL database through Drizzle ORM, which provides type-safe database operations and schema management.

- **Data Flow**: When a user interacts with the frontend, React components trigger API calls to the backend. The backend processes these requests, performs necessary database operations using Drizzle ORM, and returns the results to the frontend.

### Why This Tech Stack?

This combination of technologies offers several advantages:

- **Performance**: Bun's speed significantly reduces build times and server response times.
- **Developer Experience**: TypeScript provides type safety across the entire stack.
- **Maintainability**: The modular architecture makes it easy to update or replace individual components.
- **Scalability**: Each part of the stack is designed to handle growth, from the database to the frontend.

## Tech Stack 💻

- **Frontend** 🎨
  - [React](https://react.dev) with [Vite](https://vitejs.dev)
  - [React Router](https://reactrouter.com) v7 (routing)
  - [Shadcn UI](https://ui.shadcn.com) components
  - [TypeScript](https://www.typescriptlang.org)
  
- **Backend** ⚙️
  - [Bun](https://bun.sh) runtime
  - [Hono](https://hono.dev) (web framework)
  - [PostgreSQL](https://www.postgresql.org) database
  - [Drizzle ORM](https://orm.drizzle.team) (SQL toolkit)

## Project Checklist ✅

> **Note:** This project is currently in development. Below is a high-level checklist of remaining tasks.

- [x] Project structure and monorepo setup
- [x] Frontend and backend basic configuration
- [ ] Database schema and migrations
- [ ] Authentication system
- [ ] Frontend UI components and routing
- [ ] Backend API endpoints
- [ ] API integration with frontend
- [ ] Error handling and validation
- [ ] Production environment configuration
- [ ] Deployment setup
- [ ] Documentation

## Prerequisites ✅

- [Bun](https://bun.sh) installed
- [PostgreSQL](https://www.postgresql.org/) installed and running
- Node.js 16.0 or higher

## Getting Started 🎯

1. Clone the repository:
```bash
git clone <your-repo-url>
cd my-bun-react-shadcn-postgres-project
```

2. Install dependencies:
```bash
bun install
```

3. Set up environment variables:
```bash
# In frontend directory
cp .env.example .env.local

# In backend directory
cp .env.example .env
```

4. Start the development servers:
```bash
# Run both frontend and backend
bun run dev

# Run frontend only
bun run dev:frontend

# Run backend only
bun run dev:backend
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Project Structure 📁

```
├── frontend/           # React frontend application
├── backend/           # Bun backend server
├── package.json      # Root package.json for running both services
└── README.md
```

## Contributing 🤝

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
