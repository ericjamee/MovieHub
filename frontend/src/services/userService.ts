import { getApiBaseUrl, getDefaultFetchOptions } from "./apiConfig";

export interface User {
  id: string;
  email: string;
  roles: string[];
  username?: string;
  createdAt?: string;
  lastLogin?: string;
}

class UserService {
  async getAllUsers(): Promise<User[]> {
    const response = await fetch(
      `${getApiBaseUrl()}/user`,
      getDefaultFetchOptions()
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    
    return await response.json();
  }

  async assignRoleToUser(email: string, role: string): Promise<void> {
    const response = await fetch(
      `${getApiBaseUrl()}/role/AssignRoleToUser?userEmail=${encodeURIComponent(email)}&roleName=${encodeURIComponent(role)}`,
      {
        ...getDefaultFetchOptions("POST"),
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to assign role: ${errorData}`);
    }
  }

  async removeRoleFromUser(email: string, role: string): Promise<void> {
    const response = await fetch(
      `${getApiBaseUrl()}/role/RemoveRoleFromUser?userEmail=${encodeURIComponent(email)}&roleName=${encodeURIComponent(role)}`,
      {
        ...getDefaultFetchOptions("POST"),
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to remove role: ${errorData}`);
    }
  }
}

export const userService = new UserService(); 