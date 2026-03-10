import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from '../../contexts/RouterContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { path, navigate } = useRouter();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FFFDF7]/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate('/')}
        >
          <span className="text-xl font-bold tracking-tight text-gray-900">Preptic<span className="text-orange-500">.ai</span></span>
        </div>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('/dashboard')} className={`text-sm font-medium transition-colors ${path === '/dashboard' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Dashboard</button>
              <button onClick={() => navigate('/profile')} className={`text-sm font-medium transition-colors ${path === '/profile' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Profile</button>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" className="w-full h-full object-cover" />
                  </div>
                  <span className="hidden md:inline-block">{user.name}</span>
                </div>
                <button onClick={() => { logout(); setTimeout(() => navigate('/'), 100); }} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="px-6 py-2.5 rounded-full bg-orange-400 text-white text-sm font-medium hover:bg-orange-500 transition-colors shadow-sm shadow-orange-200">Login / Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};