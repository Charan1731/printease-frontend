'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserType = 'user' | 'vendor';

export interface User {
  id: string;
  email: string;
  fullName: string;
  userType: UserType;
  companyName?: string;
  phone?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  userType: UserType;
  companyName?: string;
  phone?: string;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Simulate API calls - replace with actual API endpoints
  const login = async (email: string, password: string, userType: UserType): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        email,
        fullName: userType === 'user' ? 'John Doe' : 'Jane Smith',
        userType,
        companyName: userType === 'vendor' ? 'ACME Corporation' : undefined,
        phone: '+1 (555) 000-0000',
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem('auth_token', 'mock_token_' + userType);
      localStorage.setItem('user_data', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const newUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        fullName: userData.fullName,
        userType: userData.userType,
        companyName: userData.companyName,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem('auth_token', 'mock_token_' + userData.userType);
      localStorage.setItem('user_data', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  const checkAuth = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        // Simulate token validation
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};