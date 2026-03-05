import React, { useState, useEffect, useContext, createContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate hitting a /me or /validate endpoint on mount (HttpOnly cookie validation)
  useEffect(() => {
    const validateSession = async () => {
      setIsLoading(true);
      try {
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        const storedSession = localStorage.getItem('mock_session');
        if (storedSession) {
          setUser(JSON.parse(storedSession));
        }
      } catch (error) {
        console.error("Session validation failed");
      } finally {
        setIsLoading(false);
      }
    };
    validateSession();
  }, []);

  const login = async (email, password) => {
    // Mock API Call
    await new Promise(resolve => setTimeout(resolve, 500));
    const mockUser = { name: 'John Doe', email, niche: 'Frontend Developer' };
    setUser(mockUser);
    localStorage.setItem('mock_session', JSON.stringify(mockUser));
  };

  const signup = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(data);
    localStorage.setItem('mock_session', JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mock_session');
  };

  const updateProfile = async (updates) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('mock_session', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);