# Bun React Shadcn PostgreSQL Project 🚀

A modern full-stack application built with Bun, React, Shadcn UI, and PostgreSQL.

<div align="center">
  ![App](https://github.com/user-attachments/assets/b93a4e89-34e9-49c1-8b68-e5ad6fba84e3)
</div>

## Tech Stack 💻

- **Frontend** 🎨
  - [React](https://react.dev) with [Vite](https://vitejs.dev)
  - [Shadcn UI](https://ui.shadcn.com) components
  - [TypeScript](https://www.typescriptlang.org)
  
- **Backend** ⚙️
  - [Bun](https://bun.sh) runtime
  - [Hono](https://hono.dev) (web framework)
  - [PostgreSQL](https://www.postgresql.org) database

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
