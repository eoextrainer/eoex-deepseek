import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from './store';
import Navigation from './components/Navigation';
import ThemeSettings from './components/ThemeSettings';
import ThemeSelector from './components/ThemeSelector';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Workspace from './pages/Workspace';
import AdminDashboard from './pages/AdminDashboard';
import SalesforceSystemAdminDashboard from './components/dashboards/SalesforceSystemAdminDashboard';
import SalesforceAdminDashboard from './components/dashboards/SalesforceAdminDashboard';
import DisneyPlusModeratorDashboard from './components/dashboards/DisneyPlusModeratorDashboard';
import NetflixUserDashboard from './components/dashboards/NetflixUserDashboard';
import NetflixGuestDashboard from './components/dashboards/NetflixGuestDashboard';
import Portfolio from './components/dashboards/Portfolio';
import OpportunitiesTrending from './components/dashboards/OpportunitiesTrending';
import { authAPI } from './api/endpoints';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  const roleName = user?.role?.name || user?.role;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (requiredRole && !roleName) return null;
  if (requiredRole && roleName !== requiredRole) return <Navigate to="/workspace" />;
  return children;
};

const AdminRedirect = () => {
  const { isAuthenticated, user } = useAuthStore();
  const roleName = user?.role?.name || user?.role;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!roleName) return null;
  if (roleName === 'system_admin') return <Navigate to="/admin/system" />;
  if (roleName === 'community_admin') return <Navigate to="/admin/community" />;
  if (roleName === 'moderator') return <Navigate to="/admin/moderator" />;
  return <Navigate to="/workspace" />;
};

function App() {
  const { token, user, setUser } = useAuthStore();
  const { currentTheme, isDarkMode } = useThemeStore();

  useEffect(() => {
    if (!token || user) return;
    authAPI
      .getCurrentUser()
      .then((response) => setUser(response.data))
      .catch(() => {
        // token invalid or expired; handled by interceptor
      });
  }, [token, user, setUser]);

  useEffect(() => {
    const themes = {
      netflix: {
        primary: '#E50914',
        secondary: '#221f1f',
        accent: '#E50914',
        background: '#141414',
        text: '#FFFFFF',
      },
      disney: {
        primary: '#0063E5',
        secondary: '#0A0F2C',
        accent: '#0063E5',
        background: '#040714',
        text: '#F5F5F5',
      },
      dark: {
        primary: '#FF0000',
        secondary: '#1A1A1A',
        accent: '#FF0000',
        background: '#0F0F0F',
        text: '#FFFFFF',
      },
      light: {
        primary: '#0070D2',
        secondary: '#E5E7EB',
        accent: '#0070D2',
        background: '#F5F5F5',
        text: '#111827',
      },
    };

    const selected = themes[currentTheme] || themes.netflix;
    const root = document.documentElement;
    root.style.setProperty('--primary-color', selected.primary);
    root.style.setProperty('--secondary-color', selected.secondary);
    root.style.setProperty('--accent-color', selected.accent);
    root.style.setProperty('--background-color', selected.background);
    root.style.setProperty('--text-color', selected.text);
    root.setAttribute('data-theme', currentTheme);
    root.classList.toggle('dark', isDarkMode);
  }, [currentTheme, isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <NetflixUserDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="/opportunities" element={<ProtectedRoute><OpportunitiesTrending /></ProtectedRoute>} />
          <Route
            path="/admin/system"
            element={<AdminRoute requiredRole="system_admin"><SalesforceSystemAdminDashboard /></AdminRoute>}
          />
          <Route
            path="/admin/community"
            element={<AdminRoute requiredRole="community_admin"><SalesforceAdminDashboard /></AdminRoute>}
          />
          <Route
            path="/admin/moderator"
            element={<AdminRoute requiredRole="moderator"><DisneyPlusModeratorDashboard /></AdminRoute>}
          />
          <Route
            path="/guest"
            element={<NetflixGuestDashboard />}
          />
          <Route
            path="/admin"
            element={<AdminRoute><AdminRedirect /></AdminRoute>}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ThemeSettings />
        {token && <ThemeSelector />}
      </div>
    </Router>
  );
}

export default App;
