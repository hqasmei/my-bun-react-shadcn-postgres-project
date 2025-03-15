// src/lib/auth-utils.ts
import { authClient } from "./auth-client";
import { NavigateFunction } from "react-router-dom";

// Create a navigation function that can be used with the router
let navigate: NavigateFunction | null = null;

// Function to set the navigate function from a component
export const setNavigate = (navigateFunction: NavigateFunction) => {
  navigate = navigateFunction;
};

export const authUtils = {
  // Check if user is logged in
  isAuthenticated: async () => {
    try {
      const session = await authClient.getSession();
      // Check if session exists and has data property
      return !!session && "data" in session && !!session.data?.user;
    } catch (error) {
      return false;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const session = await authClient.getSession();
      // Access user through the data property if it exists
      return session && "data" in session ? session.data?.user : null;
    } catch (error) {
      return null;
    }
  },

  // Login with GitHub
  login: () => {
    authClient.signIn.social({
      provider: "github",
      // Don't specify callbackURL here - let the backend handle redirects
    });
  },

  // Simplified logout to prevent backend crashes
  logout: async () => {
    try {
      // First, invalidate the session on the client side
      localStorage.removeItem("auth_session");
      sessionStorage.removeItem("auth_session");
      
      // Then send the signOut request with proper error handling
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            console.log("Successfully signed out");
            window.location.href = "/login";
          },
          onError: (error) => {
            console.error("Sign-out error:", error);
            // Still redirect to login page on error
            window.location.href = "/login";
          }
        }
      });
    } catch (error) {
      console.error("Exception during sign-out:", error);
      window.location.href = "/login";
    }
  }
};
