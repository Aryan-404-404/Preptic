import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { RouterProvider, useRouter } from './contexts/RouterContext';
import { Navbar } from './components/layout/Navbar';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './routes/ProtectedRoutes';
import { PublicRoute } from './routes/PublicRoute';

const AppContent = () => {
  const { path } = useRouter();

  // Extract just the path without query parameters
  const basePath = path.split('?')[0];

  const renderRoute = () => {
    switch (basePath) {
      case '/': return <PublicRoute><Landing /></PublicRoute>;
      case '/login': return <PublicRoute><Login /></PublicRoute>;
      case '/signup': return <PublicRoute><Signup /></PublicRoute>;
      case '/dashboard': return <Dashboard />;
      case '/profile': return <ProtectedRoute><Profile /></ProtectedRoute>;
      default: return <Landing />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-gray-900 font-sans selection:bg-orange-200 selection:text-orange-900">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.div
          key={basePath}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderRoute()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </AuthProvider>
  );
}
