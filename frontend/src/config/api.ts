// src/config/api.ts
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Helper functions for API calls
export const apiService = {
  get: (endpoint: string) => 
    fetch(`${API_URL}${endpoint}`),
  
  post: (endpoint: string, data: any) => 
    fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  
  put: (endpoint: string, data: any) => 
    fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }),
  
  delete: (endpoint: string) => 
    fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE'
    })
};