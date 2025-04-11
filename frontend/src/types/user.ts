export interface User {
  id?: string;
  email: string;
  roles: string[];
}

export interface UserResponse {
  users: User[];
  totalCount: number;
} 