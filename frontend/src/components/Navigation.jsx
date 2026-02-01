import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '../store';

export const Navigation = () => {
  const { user, logout } = useAuthStore();
  const { currentTheme } = useThemeStore();
  const roleName = user?.role?.name || user?.role;
  const isDarkTheme = ['netflix', 'disney', 'dark'].includes(currentTheme);

  return (
    <nav className="bg-gray-900/95 border-b border-gray-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">K</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline">KCD</span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-gray-300 hover:text-white transition-smooth">
              Opportunités
            </Link>
            <Link to="/community" className="text-gray-300 hover:text-white transition-smooth">
              Communauté pro
            </Link>
            {['system_admin', 'community_admin', 'moderator'].includes(roleName) && (
              <Link to="/admin" className="text-gray-300 hover:text-white transition-smooth">
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-300 text-sm">{user.email}</span>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-white transition-smooth"
                >
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${isDarkTheme ? 'text-white' : 'text-gray-300'} hover:text-white transition-smooth`}
                >
                  Se connecter
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-smooth"
                >
                  Rejoindre
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
