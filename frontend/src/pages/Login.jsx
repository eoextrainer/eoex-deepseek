import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { authAPI } from '../api/endpoints';
import { useAuthStore, useThemeStore } from '../store';

export const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(true);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();
  const { currentTheme } = useThemeStore();
  const isDarkTheme = ['netflix', 'disney', 'dark'].includes(currentTheme);

  // Demo credentials
  const demoCredentials = [
    { role: '🔐 Admin plateforme', email: 'admin@kcd-agency.com', password: 'admin123' },
    { role: '👔 Community Admin', email: 'community.admin@kcd-agency.com', password: 'comm_admin123' },
    { role: '🛡️ Modérateur', email: 'moderator@kcd-agency.com', password: 'mod123' },
    { role: '🏷️ Marque / Pro', email: 'brand@kcd-agency.com', password: 'brand123' },
    { role: '⭐ Talent Premium', email: 'premium@kcd-agency.com', password: 'premium123' },
    { role: '👤 Talent Free', email: 'free@kcd-agency.com', password: 'free123' },
    { role: '🚪 Invité', email: 'guest@kcd-agency.com', password: 'guest123' }
  ];

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
      const me = await authAPI.getCurrentUser();
      setUser(me.data);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Échec de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
        
        {/* Login Form */}
        <div className="flex-1">
          <Card className="w-full">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Se connecter</h1>
              <p className="text-gray-400">Accédez à votre espace KCD Talent Agency</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/30 border border-red-600 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="E-mail"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
                required
              />
              <Input
                label="Mot de passe"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Entrez votre mot de passe"
                required
              />

              <Button
                type="submit"
                className={`w-full mb-4 ${isDarkTheme ? 'text-white' : ''}`}
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </form>

            <p className="text-center text-gray-400">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="text-red-600 hover:text-red-500">
                En créer un
              </Link>
            </p>
          </Card>
        </div>

        {/* Demo Credentials Panel */}
        {showCredentials && (
          <div className="flex-1 lg:max-w-sm">
            <Card className="w-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-600/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span className="text-2xl">🔑</span>
                  Identifiants de démonstration
                </h2>
                <button
                  onClick={() => setShowCredentials(false)}
                  className="text-gray-400 hover:text-gray-300 text-lg"
                >
                  ✕
                </button>
              </div>

              <p className="text-gray-400 text-sm mb-4">
                Sélectionnez un rôle pour découvrir les parcours Talent ou Marque
              </p>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {demoCredentials.map((cred, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleDemoLogin(cred.email, cred.password)}
                    className="w-full p-3 bg-gray-800/50 hover:bg-blue-800/40 border border-blue-600/20 hover:border-blue-500/50 rounded-lg text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium text-sm">{cred.role}</span>
                      <span className="text-blue-400 text-xs opacity-0 group-hover:opacity-100 transition">
                        Cliquer pour utiliser
                      </span>
                    </div>
                    <div className="text-gray-400 text-xs space-y-1">
                      <div className="font-mono">
                        <span className="text-gray-500">E-mail : </span>
                        <span className="text-blue-300">{cred.email}</span>
                      </div>
                      <div className="font-mono">
                        <span className="text-gray-500">Mot de passe : </span>
                        <span className="text-green-300">{cred.password}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-blue-600/20">
                <p className="text-gray-500 text-xs">
                  💡 Astuce : comparez les accès Free et Premium pour les talents
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;

