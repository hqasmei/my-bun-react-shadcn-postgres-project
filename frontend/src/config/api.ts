export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Helper functions for API calls
export const apiService = {
  get: (endpoint: string) =>
    fetch(`${API_URL}${endpoint}`, {
      credentials: "include", // Include cookies in the request
    }),

  post: (endpoint: string, data: any) =>
    fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include", // Include cookies in the request
    }),

  put: (endpoint: string, data: any) =>
    fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "include", // Include cookies in the request
    }),

  delete: (endpoint: string) =>
    fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      credentials: "include", // Include cookies in the request
    }),
};
