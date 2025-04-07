import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials } from '../types/auth';

// Dummy user credentials
const DUMMY_USERS = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@example.com',
    password: 'password123',
    role: 'user' as const
  },
  {
    id: 2,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin' as const
  }
];

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Restored user from localStorage:', userData);
        setCurrentUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('currentUser');
      }
    } else {
      console.log('No stored user found in localStorage');
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true);
    console.log('Login attempt with:', credentials);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Find the matching user
      const user = DUMMY_USERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      
      console.log('Matching user found:', user);
      
      if (!user) {
        console.error('No matching user found for:', credentials.email);
        throw new Error('Invalid email or password');
      }
      
      // Create a user object without the password
      const authenticatedUser: User = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      };
      
      console.log('Authentication successful, user:', authenticatedUser);
      
      // Store in localStorage
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser));
      setCurrentUser(authenticatedUser);
      return authenticatedUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    console.log('Logging out user:', currentUser?.email);
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };
  
  // For debugging
  useEffect(() => {
    console.log('Auth state updated - currentUser:', currentUser);
    console.log('Auth state updated - isAuthenticated:', !!currentUser);
  }, [currentUser]);
  
  const value = {
    currentUser,
    isLoading,
    login,
    logout,
    isAuthenticated: !!currentUser
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext; 