import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';

export const PublicRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    const { navigate } = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            navigate('/dashboard');
        }
    }, [user, isLoading, navigate]);

    if (isLoading) return null;
    return !user ? children : null;
};