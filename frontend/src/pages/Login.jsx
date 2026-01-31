import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { authAPI } from '../api/endpoints';
import { useAuthStore } from '../store';

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.login(formData);
      setToken(response.data.access_token);
      setUser(response.data);
      navigate('/workspace');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
          <p className="text-gray-400">Welcome back to EOEX</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-600 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <Button
            type="submit"
            className="w-full mb-4"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <p className="text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-red-600 hover:text-red-500">
            Create one
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-6 p-3 bg-blue-900/30 border border-blue-600 rounded-lg">
          <p className="text-blue-400 text-xs mb-2 font-semibold">Demo Credentials:</p>
          <p className="text-blue-300 text-xs">Email: demo@eoex.com</p>
          <p className="text-blue-300 text-xs">Password: password123</p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
