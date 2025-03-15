import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

// Import pages
import HomePage from "./pages/HomePage";
import RecipesPage from "./pages/RecipesPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import AddRecipePage from "./pages/AddRecipePage";
import NotFoundPage from "./pages/NotFoundPage";
import EditRecipePage from "./pages/EditRecipePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      {
        path: "recipes",
        element: (
          <ProtectedRoute>
            <RecipesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "recipes/add",
        element: (
          <ProtectedRoute>
            <AddRecipePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "recipes/:id/edit",
        element: (
          <ProtectedRoute>
            <EditRecipePage />
          </ProtectedRoute>
        ),
      },
      { path: "recipes/:id", element: <RecipeDetailPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
