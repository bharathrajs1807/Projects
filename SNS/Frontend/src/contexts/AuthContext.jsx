import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        // Try to refresh the token and get user info
        try {
          const response = await authService.refreshToken(refreshToken);
          if (response.user) {
            setUser(response.user);
            // Update the refresh token if a new one was provided
            if (response.refreshToken) {
              localStorage.setItem('refreshToken', response.refreshToken);
            }
            setLoading(false);
            return;
          }
        } catch (refreshError) {
          console.log('Refresh token failed, trying /me endpoint');
        }
      }

      // If no refresh token or refresh failed, try the /me endpoint
      try {
        const response = await authService.getMe();
        if (response.user) {
          setUser(response.user);
          setLoading(false);
          return;
        }
      } catch (meError) {
        console.log('No active session found');
      }

      // Clear any invalid tokens
      localStorage.removeItem('refreshToken');
    } catch (error) {
      console.error('Session check failed:', error);
      // Clear invalid token
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authService.signup(userData);
      localStorage.setItem('refreshToken', response.refreshToken);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};