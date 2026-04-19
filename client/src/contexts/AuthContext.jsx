import React, { useState, useEffect, useContext, createContext } from 'react';
import api from '../config/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateSession = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/api/user/profile');
          setUser(res.data);
        }
      } catch (error) {
        console.error("Session validation failed", error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    validateSession();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/user/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        chosenNiche: res.data.chosenNiche,
        techStack: res.data.techStack,
        progress: res.data.progress,
      });
    } catch (error) {
      console.error("Login error", error);
      throw error;
    }
  };

  const signup = async (data) => {
    try {
      const res = await api.post('/api/user/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      localStorage.setItem('token', res.data.token);
      setUser({
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        chosenNiche: res.data.chosenNiche,
        techStack: res.data.techStack,
        progress: res.data.progress,
      });
    } catch (error) {
      console.error("Signup error", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  const updateProfile = async (updates) => {
    try {
      const res = await api.put('/api/user/profile', updates);
      setUser(res.data);
    } catch (error) {
      console.error("Update profile error", error);
      throw error;
    }
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);