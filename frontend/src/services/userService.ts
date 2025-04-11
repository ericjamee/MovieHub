import axios from "axios";
import { User } from "../types/user";

const API_BASE_URL =
  "https://cineniche-team-3-8-backend-eehrgvh4fhd7f8b9.eastus-01.azurewebsites.net";

// Add error handling wrapper
const handleApiError = async (apiCall: () => Promise<any>) => {
  try {
    return await apiCall();
  } catch (error) {
    console.error("API Error:", error);
    if (axios.isAxiosError(error)) {
      console.error("API Response:", error.response?.data);
      console.error("API Status:", error.response?.status);
    }
    throw error;
  }
};

export const userService = {
  async getUsers(): Promise<User[]> {
    return handleApiError(async () => {
      const response = await axios.get(`${API_BASE_URL}/users`, {
        withCredentials: true,
      });
      return response.data;
    });
  },

  async assignRole(userEmail: string, roleName: string): Promise<string> {
    return handleApiError(async () => {
      const response = await axios.post(
        `${API_BASE_URL}/Role/AssignRoleToUser?userEmail=${encodeURIComponent(userEmail)}&roleName=${encodeURIComponent(roleName)}`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    });
  },

  async removeRole(userEmail: string, roleName: string): Promise<string> {
    return handleApiError(async () => {
      const response = await axios.post(
        `${API_BASE_URL}/Role/RemoveRoleFromUser?userEmail=${encodeURIComponent(userEmail)}&roleName=${encodeURIComponent(roleName)}`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    });
  },

  // If we need to use Identity API's user list
  async getUsersFromIdentity(): Promise<User[]> {
    return handleApiError(async () => {
      try {
        // Try dedicated endpoint first
        const response = await axios.get(`${API_BASE_URL}/Users`, {
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        console.log("Dedicated users endpoint failed, trying Identity API");
        
        // Fallback to Identity API
        const response = await axios.get(`${API_BASE_URL}/identity/users`, {
          withCredentials: true,
        });
        return response.data.map((user: any) => ({
          email: user.email,
          roles: user.roles || [],
          id: user.id
        }));
      }
    });
  }
}; 