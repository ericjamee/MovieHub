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
}

export const userService = new UserService(); 