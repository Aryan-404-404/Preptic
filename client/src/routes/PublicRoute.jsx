import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from '../contexts/RouterContext';

export const PublicRoute = ({ children }) => {
    const { user, isLoading } = useAuth();
    const { navigate, path } = useRouter();

    const basePath = path.split('?')[0];
    const isPendingSignup = basePath === '/signup' && user && !user.chosenNiche;

    useEffect(() => {
        if (!isLoading && user) {
            // Allow signup flow to complete even if user is logged in
            // Check if they're still on signup page and haven't chosen a niche yet
            if (isPendingSignup) {
                return;
            }
            navigate('/dashboard');
        }
    }, [user, isLoading, navigate, isPendingSignup]);

    if (isLoading) return null;
    
    // Render the page if there is no user, OR if the user is logged in but still needs to finish Step 2 of signup
    return (!user || isPendingSignup) ? children : null;
};