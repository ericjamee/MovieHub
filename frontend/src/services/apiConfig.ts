// API base URL configuration
const API_BASE_URL = "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net";

// Export the base URL as a constant
export const getApiBaseUrl = () => API_BASE_URL;

// Helper for authentication endpoints
export const getAuthUrl = (endpoint: string) => `${API_BASE_URL}/${endpoint}`;

// Helper for movie endpoints
export const getMovieUrl = (endpoint: string) => `${API_BASE_URL}/Movie/${endpoint}`;

// Export common fetch options
export const getDefaultFetchOptions = (method: string = "GET") => ({
  method,
  credentials: "include" as RequestCredentials,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
}); 