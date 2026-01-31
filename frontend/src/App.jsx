import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import Navigation from './components/Navigation';
import ThemeSettings from './components/ThemeSettings';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Workspace from './pages/Workspace';
import AdminDashboard from './pages/AdminDashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const isAdmin = user?.role === 'system_admin' || user?.role === 'admin';
  return isAuthenticated && isAdmin ? children : <Navigate to="/workspace" />;
};

function App() {
  const { token } = useAuthStore();

  useEffect(() => {
    // Initialize app - check if user is logged in
    if (token) {
      // Could fetch user data here if needed
    }
  }, [token]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/workspace"
            element={
              <ProtectedRoute>
                <Workspace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ThemeSettings />
      </div>
    </Router>
  );
}

export default App;
