// src/lib/auth-utils.ts
import { authClient } from "./auth-client";

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
    });
  },

  // Logout
  logout: async () => {
    await authClient.signOut();
  },
};
