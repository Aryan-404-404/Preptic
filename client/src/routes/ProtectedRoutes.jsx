import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';

export const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) return <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center text-orange-400"><div className="w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"></div></div>;
  
  return user ? children : null;
};