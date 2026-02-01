import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { opportunityAPI } from '../../api/endpoints';
import { useAuthStore } from '../../store';

export default function NetflixGuestDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [previewHighlights, setPreviewHighlights] = useState([]);
  const previewLevel = 1;
  const previewProgress = 20;
  const unlocks = [
    { level: 3, label: 'Accès aux collaborations rémunérées' },
    { level: 5, label: 'Visibilité accrue' },
    { level: 7, label: 'Événements exclusifs' },
    { level: 10, label: 'Contrat KCD Talent Agency' },
  ];

  useEffect(() => {
    fetchGuestPreview();
  }, []);

  const fetchGuestPreview = async () => {
    try {
      const response = await opportunityAPI.getOpportunities().catch(() => ({ data: [] }));
      const opportunities = response.data || [];
      const preview = opportunities.slice(0, 5).map((opp, index) => ({
        id: opp.id,
        title: opp.title,
        category: opp.tier,
        preview: index < 2,
      }));
      setPreviewHighlights(preview);
    } catch (error) {
      console.error('Failed to load guest preview:', error);
    }
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Lock Banner */}
        <div
          className="mb-12 p-6 rounded-lg border-l-4"
          style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 80%, transparent)', borderColor: 'var(--primary-color)' }}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🔒</span>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--primary-color)' }}>
              Accès Limité - Visiteur
            </h1>
          </div>
          <p style={{ color: 'var(--text-color)', opacity: 0.8 }} className="mb-4">
            Vous avez accès à une version limitée de la plateforme. Votre compte a été demandé par un admin communauté et activé par un admin système pour une période limitée.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="px-6 py-3 rounded font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: 'var(--primary-color)' }}
          >
            Créer un Compte Complet
          </button>
        </div>

        {/* Preview Info */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Aperçu des Fonctionnalités</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
              <h3 className="font-bold mb-3 text-lg" style={{ color: 'var(--primary-color)' }}>✓ Accessible</h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                <li>• Voir 2 opportunités</li>
                <li>• Lire les descriptions des castings</li>
                <li>• Consulter les workshops</li>
                <li>• Chat de support limité</li>
              </ul>
            </div>
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)' }}>
              <h3 className="font-bold mb-3 text-lg" style={{ color: 'var(--text-color)', opacity: 0.6 }}>🔒 Restreint</h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-color)', opacity: 0.5 }}>
                <li>• Postuler aux opportunités</li>
                <li>• Accès aux abonnements payants</li>
                <li>• Accès au réseau de talents</li>
                <li>• Support 24/7</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Gamification Preview */}
        <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                🎯 Progression & Niveaux (Aperçu)
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                Tous les mannequins commencent Niveau 1 et progressent jusqu’à 10.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Niveau actuel</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>Niveau {previewLevel}</p>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              <span>Progression vers le niveau 2</span>
              <span>{previewProgress}%</span>
            </div>
            <div className="w-full h-2 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
              <div className="h-2 rounded" style={{ width: `${previewProgress}%`, backgroundColor: 'var(--primary-color)' }} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlocks.map((unlock) => (
              <div
                key={unlock.level}
                className="p-4 rounded border"
                style={{
                  borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--text-color) 5%, transparent)'
                }}
              >
                <p className="text-sm font-semibold" style={{ color: 'var(--text-color)' }}>
                  Niveau {unlock.level}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>{unlock.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Limited Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Aperçu des Opportunités</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {previewHighlights.map((highlight) => (
              <div
                key={highlight.id}
                className="rounded-lg overflow-hidden relative group cursor-pointer"
                style={{ backgroundColor: 'var(--secondary-color)' }}
              >
                <div
                  className="w-full h-64 flex items-center justify-center bg-gradient-to-br"
                  style={{ backgroundImage: 'linear-gradient(135deg, var(--secondary-color) 0%, color-mix(in srgb, var(--secondary-color) 80%, transparent) 100%)' }}
                >
                  <span className="text-6xl">🎬</span>
                </div>

                {!highlight.preview && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
                    <span className="text-4xl mb-2">🔒</span>
                    <p style={{ color: 'var(--primary-color)' }} className="font-bold text-center">
                      Accès Restreint
                    </p>
                  </div>
                )}

                <div className="p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)' }}>
                  <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--text-color)' }}>
                    {highlight.title}
                  </h3>
                  <span
                    className="text-xs px-2 py-1 rounded inline-block"
                    style={{
                      backgroundColor: highlight.preview ? 'var(--primary-color)' : 'color-mix(in srgb, var(--text-color) 15%, transparent)',
                      color: highlight.preview ? 'var(--text-color)' : 'var(--text-color)',
                      opacity: highlight.preview ? 1 : 0.6
                    }}
                  >
                    {highlight.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Status */}
        <div className="p-8 rounded-lg mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Statut du Compte</h2>
          <div className="space-y-4">
            <div className="p-4 rounded border" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)', borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-color)' }}>Type de Compte</h3>
              <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>{user?.role?.name || 'guest'} - Accès Temporaire</p>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)', borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-color)' }}>Activation</h3>
              <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>{user?.is_active ? 'Activé par Admin Système' : 'En attente d\'activation'}</p>
            </div>
            <div className="p-4 rounded border" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)', borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
              <h3 className="font-bold mb-2" style={{ color: 'var(--text-color)' }}>Demandeur</h3>
              <p style={{ color: 'var(--text-color)', opacity: 0.8 }}>Admin Communauté - Support</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-8 rounded-lg text-center" style={{ backgroundColor: 'var(--primary-color)' }}>
          <h2 className="text-3xl font-bold mb-4 text-white">Prêt à Rejoindre?</h2>
          <p className="mb-6 text-white text-lg">
            Créez votre compte complet pour accéder à toutes les opportunités et fonctionnalités
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-3 rounded-lg font-bold transition hover:bg-white"
              style={{ backgroundColor: '#FFFFFF', color: 'var(--primary-color)' }}
            >
              S'Inscrire Maintenant
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-3 rounded-lg font-bold border-2 border-white text-white transition hover:bg-white hover:text-red-600"
            >
              Se Connecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
