import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Card } from '../components/ui';
import { authAPI } from '../api/endpoints';
import { useAuthStore } from '../store';

export const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      });
      
      setToken(response.data.access_token);
      setUser(response.data);
      navigate('/workspace');
    } catch (err) {
      setError(err.response?.data?.detail || "Échec de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Créer un compte</h1>
          <p className="text-gray-400">Rejoignez KCD Talent Agency en tant que talent ou marque</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-600 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="Prénom"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom"
              required
            />
            <Input
              label="Nom"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nom"
              required
            />
          </div>

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
            placeholder="Créez un mot de passe"
            required
          />
          <Input
            label="Confirmer le mot de passe"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirmez votre mot de passe"
            required
          />

          <div className="mb-4">
            <label className="flex items-center space-x-2 text-gray-300">
              <input type="checkbox" className="w-4 h-4" required />
              <span className="text-sm">J'accepte les conditions d'utilisation et la charte pro</span>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full mb-4"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? 'Création du compte...' : 'Créer un compte'}
          </Button>
        </form>

        <p className="text-center text-gray-400">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-red-600 hover:text-red-500">
            Se connecter
          </Link>
        </p>
      </Card>
    </div>
  );
};

export default Register;
