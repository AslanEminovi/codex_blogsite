'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthResponse, AuthContextType } from '@/types';
import { authAPI } from '@/services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on app load
    const initAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      
      setUser(response);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Login failed';
      throw new Error(typeof message === 'string' ? message : 'Login failed');
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ username, email, password });
      
      // Store auth data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      
      setUser(response);
    } catch (error: unknown) {
      const message = (error as { response?: { data?: string } })?.response?.data || 'Registration failed';
      throw new Error(typeof message === 'string' ? message : 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};