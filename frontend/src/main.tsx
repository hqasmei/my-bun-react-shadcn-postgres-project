import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";
import { Toaster } from "@/components/ui/sonner";

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
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "recipes",
        element: <RecipesPage />,
      },
      {
        path: "recipes/add",
        element: <AddRecipePage />,
      },
      {
        path: "recipes/:id/edit",
        element: <EditRecipePage />,
      },
      {
        path: "recipes/:id",
        element: <RecipeDetailPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
