'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';

export type UserType = 'user' | 'vendor';

export interface User {
  id: string;
  email: string;
  name: string;
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
  confirmPassword: string;
  name: string;
  userType: UserType;
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

      if(userType === 'user') {
        const userResponse = await fetch("http://localhost:8080/api/v1/user/sign-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if(!userResponse.ok){
          throw new Error("Failed to login");
        }

        const userData = await userResponse.json();
        setUser(userData.data.user);
        localStorage.setItem('auth_token', userData.data.token);
        localStorage.setItem('user_data', JSON.stringify(userData.data.user));
        console.log("user authenticated");
      }
      if(userType === 'vendor'){
        const vendorResponse = await fetch("http://localhost:8080/api/v1/vendor/sign-in", {
          method: "POST",
          headers:{
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if(!vendorResponse.ok){
          throw new Error("Failed to login");
        }

        const vendorData = await vendorResponse.json();
        setUser(vendorData.data.user);
        localStorage.setItem('auth_token', vendorData.data.token);
        localStorage.setItem('user_data', JSON.stringify(vendorData.data.user));
        console.log("vendor authenticated");
      }
      
    } catch (error) {
      console.log(error);
      toast.error("Failed to login");
    }
    setIsLoading(false);
  };

  const register = async (userData: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      if(userData.userType === 'user'){
        const userResponse = await fetch("http://localhost:8080/api/v1/user/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        console.log(userResponse);

        if(!userResponse.ok){
          throw new Error("Failed to register");
        }

        const user = await userResponse.json();
        setUser(user.data.user);
        localStorage.setItem('auth_token', user.data.token);
        localStorage.setItem('user_data', JSON.stringify(user.data.user));
      }
      if(userData.userType === 'vendor'){
        const vendorResponse = await fetch("http://localhost:8080/api/v1/vendor/sign-up", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        if(!vendorResponse.ok){
          throw new Error("Failed to register");
        }

        const vendor = await vendorResponse.json();
        setUser(vendor.data.user);
        localStorage.setItem('auth_token', vendor.data.token);
        localStorage.setItem('user_data', JSON.stringify(vendor.data.user));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to register");
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
        const storedUser = JSON.parse(userData);
        const userType = storedUser.userType;
        
        // Call appropriate endpoint based on user type
        const endpoint = userType === 'vendor' 
          ? "http://localhost:8080/api/v1/vendor/sample"
          : "http://localhost:8080/api/v1/user/sample";

        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if(!response.ok){
          throw new Error("Failed to check auth");
        }

        const result = await response.json();
        // For user endpoint, the response has user property, for vendor it doesn't
        const authenticatedUser = result.user || storedUser;
        setUser(authenticatedUser);
        console.log(`${userType} authenticated`);
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