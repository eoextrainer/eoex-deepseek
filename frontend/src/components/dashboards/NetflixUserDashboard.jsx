import React, { useState, useEffect } from 'react';
import {
  opportunityAPI,
  subscriptionAPI,
  featureRequestAPI,
} from '../../api/endpoints';
import { useAuthStore } from '../../store';
import BrandVerification from '../BrandVerification';

export default function NetflixUserDashboard() {
  const { user } = useAuthStore();
  const [featureRequest, setFeatureRequest] = useState('');
  const [profile, setProfile] = useState({
    pseudo: '',
    location: '',
    profileType: 'débutant',
  });
  const [premiumProfile, setPremiumProfile] = useState({
    measurements: '',
    experience: '',
    availability: '',
    socials: '',
  });
  const [brandProfile, setBrandProfile] = useState({
    structureName: '',
    sector: '',
    needs: '',
    verificationStatus: 'not_started', // not_started, pending, verified, rejected
    verificationData: null,
    submittedAt: null,
  });
  const [brandAnnouncements, setBrandAnnouncements] = useState([
    {
      id: 1,
      title: 'Collaboration Lookbook SS26',
      status: 'Publié',
      location: 'Paris',
    },
    {
      id: 2,
      title: 'Casting Digital Campaign',
      status: 'Brouillon',
      location: 'Lyon',
    },
  ]);
  const [publications, setPublications] = useState([
    {
      id: 1,
      title: 'Shooting éditorial — Paris',
      content: 'Retour de collaboration avec Studio Lumière. Merci pour la confiance ✨',
      likes: 24,
      comments: 6,
      type: 'texte',
    },
    {
      id: 2,
      title: 'Backstage Fashion Week',
      content: 'Highlights photos d’une mission récente.',
      likes: 58,
      comments: 12,
      type: 'photo',
    },
  ]);
  const [collaborationHistory] = useState([
    { id: 1, project: 'Campagne SS26 — Maison Atelier', status: 'En cours', date: '12/01/2026' },
    { id: 2, project: 'Lookbook — Studio Polaris', status: 'Acceptée', date: '21/12/2025' },
  ]);
  const [notifications] = useState([
    { id: 1, label: '3 nouvelles opportunités correspondent à votre profil' },
    { id: 2, label: 'Maison Atelier a répondu à votre candidature' },
  ]);
  const [communityPosts] = useState([
    { id: 1, topic: 'Conseils métier', title: 'Préparer un book pro', replies: 12 },
    { id: 2, topic: 'Retours d’expérience', title: 'Collaboration avec une grande maison', replies: 4 },
    { id: 3, topic: 'Annonces internes', title: 'Casting interne KCD — Février', replies: 8 },
  ]);
  const [gamificationMetrics] = useState({
    participation: 6,
    professionalisme: 7,
    brandRating: 4.6,
    missions: 3,
  });
  const [highlights, setHighlights] = useState([]);
  const [topSubscriptions, setTopSubscriptions] = useState([]);
  const [userSubscriptions, setUserSubscriptions] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchUserDashboard();
  }, [user?.id]);

  const fetchUserDashboard = async () => {
    try {
      const [plansRes, subscriptionsRes, userSubscriptionsRes, opportunitiesRes] = await Promise.all([
        subscriptionAPI.getPlans().catch(() => ({ data: [] })),
        subscriptionAPI.getSubscriptions().catch(() => ({ data: [] })),
        user?.id ? subscriptionAPI.getUserSubscriptions(user.id).catch(() => ({ data: [] })) : Promise.resolve({ data: [] }),
        opportunityAPI.getOpportunities().catch(() => ({ data: [] })),
      ]);

      const plansData = plansRes.data || [];
      const subscriptionsData = subscriptionsRes.data || [];
      const userSubscriptionsData = userSubscriptionsRes.data || [];
      const opportunitiesData = opportunitiesRes.data || [];

      setPlans(plansData);
      setUserSubscriptions(userSubscriptionsData);
      setHighlights(opportunitiesData.slice(0, 5));

      const countsByPlan = subscriptionsData.reduce((acc, sub) => {
        acc[sub.plan_id] = (acc[sub.plan_id] || 0) + 1;
        return acc;
      }, {});

      const topPlans = plansData
        .map((plan) => ({
          name: plan.name,
          users: countsByPlan[plan.id] || 0,
        }))
        .sort((a, b) => b.users - a.users)
        .slice(0, 5);

      setTopSubscriptions(topPlans);
    } catch (error) {
      console.error('Failed to load user dashboard:', error);
    }
  };

  const handleCancelSubscription = async (subscriptionId) => {
    try {
      await subscriptionAPI.deleteSubscription(subscriptionId);
      await fetchUserDashboard();
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
    }
  };

  const handleSubmitFeatureRequest = async () => {
    if (!featureRequest.trim()) return;
    try {
      await featureRequestAPI.create({
        title: featureRequest.trim().slice(0, 80),
        description: featureRequest.trim(),
        priority: 'medium',
      });
      setFeatureRequest('');
    } catch (error) {
      console.error('Failed to submit feature request:', error);
    }
  };

  const planMap = plans.reduce((acc, plan) => {
    acc[plan.id] = plan;
    return acc;
  }, {});

  const primarySubscription = userSubscriptions[0];
  const primaryPlanName = primarySubscription ? planMap[primarySubscription.plan_id]?.name : '';
  const hasActiveSubscription = userSubscriptions.some((sub) => ['active', 'paid'].includes(sub.status));
  const isFree = !hasActiveSubscription || /gratuit|free/i.test(primaryPlanName || '');
  const isBrand = !!user?.email && user.email === 'brand@kcd-agency.com';
  const displayedHighlights = isFree ? highlights.slice(0, 2) : highlights;

  const handleProfileChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePremiumProfileChange = (field, value) => {
    setPremiumProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleBrandProfileChange = (field, value) => {
    setBrandProfile((prev) => ({ ...prev, [field]: value }));
  };

  const gamificationScore = Math.min(
    100,
    Math.round(
      gamificationMetrics.participation * 6 +
      gamificationMetrics.professionalisme * 6 +
      gamificationMetrics.brandRating * 8 +
      gamificationMetrics.missions * 10
    )
  );
  const level = Math.min(10, Math.max(1, Math.floor(gamificationScore / 10) + 1));
  const progressToNext = (gamificationScore % 10) * 10;
  const unlocks = [
    { level: 3, label: 'Accès aux collaborations rémunérées' },
    { level: 5, label: 'Visibilité accrue dans l’annuaire' },
    { level: 7, label: 'Accès aux événements exclusifs' },
    { level: 10, label: 'Contrat potentiel avec KCD Talent Agency' },
  ];

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--primary-color)' }}>
            Bienvenue {user?.full_name}
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
            {isFree
              ? "Compte Free (Découverte) · Accès lecture seule aux opportunités et communauté"
              : isBrand
                ? "Espace Marque Pro · Publiez vos collaborations et contactez les profils Premium"
                : "Découvrez les meilleures opportunités adaptées à votre abonnement"}
          </p>
        </div>

        {/* Gamification System */}
        <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                🎯 Progression & Niveaux
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                {isBrand
                  ? "Suivez la progression de votre profil marque et votre visibilité auprès des talents."
                  : "Tous les mannequins commencent Niveau 1 — progression basée sur participation, professionnalisme, retours marques et missions."}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Niveau actuel</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--primary-color)' }}>Niveau {level}</p>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              <span>Progression vers le niveau {Math.min(10, level + 1)}</span>
              <span>{progressToNext}%</span>
            </div>
            <div className="w-full h-2 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
              <div
                className="h-2 rounded"
                style={{ width: `${progressToNext}%`, backgroundColor: 'var(--primary-color)' }}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Participation', value: `${gamificationMetrics.participation}/10` },
              { label: 'Professionnalisme', value: `${gamificationMetrics.professionalisme}/10` },
              { label: 'Retours marques', value: `${gamificationMetrics.brandRating}★` },
              { label: 'Missions réalisées', value: `${gamificationMetrics.missions}` },
            ].map((metric) => (
              <div key={metric.label} className="p-4 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--background-color) 70%, transparent)' }}>
                <p className="text-xs uppercase" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{metric.label}</p>
                <p className="text-xl font-bold" style={{ color: 'var(--text-color)' }}>{metric.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlocks.map((unlock) => (
              <div
                key={unlock.level}
                className="p-4 rounded border"
                style={{
                  borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)',
                  backgroundColor: level >= unlock.level
                    ? 'color-mix(in srgb, #22c55e 15%, transparent)'
                    : 'color-mix(in srgb, var(--text-color) 5%, transparent)'
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

        {!isBrand && (
        <>
        {/* Subscription Badge */}
        <div
          className="mb-12 p-6 rounded-lg border-l-4"
          style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
        >
          <h2 className="font-bold text-lg mb-2" style={{ color: 'var(--text-color)' }}>Votre Abonnement</h2>
          <div className="flex justify-between items-center">
            <div>
              <p style={{ color: 'var(--primary-color)' }} className="text-2xl font-bold">
                {primarySubscription ? planMap[primarySubscription.plan_id]?.name : 'Aucun plan actif'}
              </p>
              <p style={{ color: 'var(--text-color)', opacity: 0.7 }} className="text-sm mt-1">
                Renouvellement: {primarySubscription?.created_at ? new Date(primarySubscription.created_at).toLocaleDateString('fr-FR') : '—'}
              </p>
            </div>
            <button
              className="px-6 py-2 rounded font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--primary-color)' }}
              disabled={isFree}
            >
              {isFree ? 'Passer Premium' : "Gérer l'Abonnement"}
            </button>
          </div>
        </div>
        </>
        )}

        {/* Brand Pro Profile */}
        {isBrand && (
          <>
            <BrandVerification
              user={user}
              brandProfile={brandProfile}
              onUpdate={setBrandProfile}
            />

            <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                    🏷️ Profil Marque (Accès gratuit stratégique)
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                    Informations requises pour publier des collaborations et contacter les profils Premium.
                  </p>
                </div>
                <span
                  className="px-4 py-2 rounded text-xs font-semibold"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 20%, transparent)', color: 'var(--primary-color)' }}
                >
                  Accès gratuit
                </span>
              </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Nom de la structure</label>
                <input
                  value={brandProfile.structureName}
                  onChange={(e) => handleBrandProfileChange('structureName', e.target.value)}
                  placeholder="Nom de la marque"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                  disabled={brandProfile.verificationStatus === 'verified'}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Secteur d’activité</label>
                <input
                  value={brandProfile.sector}
                  onChange={(e) => handleBrandProfileChange('sector', e.target.value)}
                  placeholder="Mode, beauté, luxe, retail"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                  disabled={brandProfile.verificationStatus === 'verified'}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Description des besoins</label>
                <input
                  value={brandProfile.needs}
                  onChange={(e) => handleBrandProfileChange('needs', e.target.value)}
                  placeholder="Casting, campagne, lookbook"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                  disabled={brandProfile.verificationStatus === 'verified'}
                />
              </div>
            </div>
          </div>
          </>
        )}

        {/* Basic Profile (Free) */}
        {isFree && (
          <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
              🪪 Profil Basique (Free)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Nom / Pseudo</label>
                <input
                  value={profile.pseudo}
                  onChange={(e) => handleProfileChange('pseudo', e.target.value)}
                  placeholder={user?.full_name || 'Votre pseudo'}
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Localisation</label>
                <input
                  value={profile.location}
                  onChange={(e) => handleProfileChange('location', e.target.value)}
                  placeholder="Ville, Pays"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Type de profil</label>
                <select
                  value={profile.profileType}
                  onChange={(e) => handleProfileChange('profileType', e.target.value)}
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                >
                  <option value="débutant">Débutant</option>
                  <option value="amateur">Amateur</option>
                  <option value="confirmé">Confirmé</option>
                </select>
              </div>
            </div>
            <p className="text-xs mt-4" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
              Profil Free : informations limitées. Passez Premium pour un profil complet.
            </p>
          </div>
        )}

        {/* Premium Profile */}
        {!isFree && (
          <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                  ⭐ Profil Avancé (Premium)
                </h2>
                <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Profil prioritaire dans l’annuaire · Badge Premium actif
                </p>
              </div>
              <div className="flex gap-3">
                <span
                  className="px-4 py-2 rounded text-xs font-semibold"
                  style={{ backgroundColor: 'color-mix(in srgb, #f59e0b 20%, transparent)', color: '#f59e0b' }}
                >
                  🏅 Premium
                </span>
                <span
                  className="px-4 py-2 rounded text-xs font-semibold"
                  style={{ backgroundColor: 'color-mix(in srgb, #22c55e 20%, transparent)', color: '#22c55e' }}
                >
                  ✅ Profil actif
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Mensurations</label>
                <input
                  value={premiumProfile.measurements}
                  onChange={(e) => handlePremiumProfileChange('measurements', e.target.value)}
                  placeholder="Ex: 180cm • 86/60/90"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Expériences</label>
                <input
                  value={premiumProfile.experience}
                  onChange={(e) => handlePremiumProfileChange('experience', e.target.value)}
                  placeholder="Campagnes, défilés, shootings"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Disponibilités</label>
                <input
                  value={premiumProfile.availability}
                  onChange={(e) => handlePremiumProfileChange('availability', e.target.value)}
                  placeholder="Ex: Paris • 10-20 février"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                />
              </div>
              <div>
                <label className="text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Réseaux sociaux (optionnel)</label>
                <input
                  value={premiumProfile.socials}
                  onChange={(e) => handlePremiumProfileChange('socials', e.target.value)}
                  placeholder="Instagram, TikTok, Behance"
                  className="w-full mt-2 p-3 rounded bg-black text-white border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Limited Portfolio (Free) */}
        {isFree && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
              📸 Portfolio Limité
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="rounded-lg overflow-hidden border"
                style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 40%, transparent)', backgroundColor: 'var(--secondary-color)' }}
              >
                <div className="h-56 bg-gradient-to-br from-gray-800 to-gray-900" />
                <div className="p-4">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-color)' }}>Photo principale</p>
                  <p className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.6 }}>1 photo autorisée</p>
                </div>
              </div>
              {[1, 2].map((slot) => (
                <div
                  key={slot}
                  className="rounded-lg overflow-hidden border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)', backgroundColor: 'var(--secondary-color)' }}
                >
                  <div className="h-56 bg-gradient-to-br from-gray-800 to-gray-900" />
                  <div className="p-4">
                    <p className="text-sm font-semibold" style={{ color: 'var(--text-color)' }}>Photo {slot}</p>
                    <p className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.6 }}>2 photos maximum</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Portfolio */}
        {!isFree && !isBrand && (
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                📸 Portfolio Complet (Photos illimitées · Vidéos optionnelles)
              </h2>
              <div className="flex gap-3">
                <button
                  className="px-4 py-2 rounded font-semibold text-white"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  Ajouter photos
                </button>
                <button
                  className="px-4 py-2 rounded font-semibold"
                  style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)', color: 'var(--text-color)' }}
                >
                  Ajouter vidéo
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--secondary-color)' }}>
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900" />
                  <div className="p-3">
                    <p className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Média {idx + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Latest Highlights */}
        {!isBrand && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Les Dernières Actualités</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {displayedHighlights.map((highlight) => (
                <div
                  key={highlight.id}
                  className="rounded-lg overflow-hidden cursor-pointer group relative"
                  style={{ backgroundColor: 'var(--secondary-color)' }}
                >
                  <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
                    <h3 className="font-bold text-white mb-2">{highlight.title}</h3>
                    <span className="text-xs px-2 py-1 rounded w-fit" style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-color)' }}>
                      {highlight.tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Brand Collaborations */}
        {isBrand && (
          <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>📣 Annonces de collaboration</h2>
              <button
                className="px-4 py-2 rounded font-semibold text-white"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                Publier une annonce
              </button>
            </div>
            <div className="space-y-4">
              {brandAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-4 rounded border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                >
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-color)' }}>{announcement.title}</p>
                    <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>{announcement.location}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 15%, transparent)', color: 'var(--primary-color)' }}>
                    {announcement.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Premium Profiles Access */}
        {isBrand && (
          <div className="mb-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>⭐ Profils Premium en priorité</h2>
              <span className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Accès aux portfolios et publications</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {highlights.slice(0, 4).map((highlight) => (
                <div
                  key={highlight.id}
                  className="rounded-lg overflow-hidden border"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)', backgroundColor: 'var(--secondary-color)' }}
                >
                  <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900" />
                  <div className="p-4">
                    <p className="font-semibold" style={{ color: 'var(--text-color)' }}>{highlight.title}</p>
                    <p className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Profil Premium prioritaire</p>
                    <button
                      className="mt-3 w-full py-2 rounded font-semibold text-white"
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      Voir portfolio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Subscriptions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Top 5 Abonnements</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {topSubscriptions.map((sub, idx) => (
              <div
                key={`${sub.name}-${idx}`}
                className="p-6 rounded-lg border cursor-pointer transition hover:shadow-lg"
                style={{
                  backgroundColor: 'var(--secondary-color)',
                  borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)'
                }}
              >
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="font-bold mb-2" style={{ color: 'var(--text-color)' }}>{sub.name}</h3>
                <p style={{ color: 'var(--text-color)', opacity: 0.7 }} className="text-sm mb-4">
                  {sub.users.toLocaleString()} utilisateurs
                </p>
                <button
                  className="w-full py-2 rounded font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  Découvrir
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Management */}
        {!isBrand && (
          <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Gestion des Abonnements</h2>
            <div className="space-y-4">
              {userSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded border flex justify-between items-center"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)'
                  }}
                >
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--text-color)' }}>{planMap[sub.plan_id]?.name || `Plan ${sub.plan_id}`}</h3>
                    <p style={{ color: 'var(--text-color)', opacity: 0.7 }} className="text-sm">Statut: {sub.status}</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 rounded font-semibold text-white hover:opacity-90"
                      style={{ backgroundColor: 'var(--primary-color)' }}
                      onClick={() => handleCancelSubscription(sub.id)}
                      disabled={isFree}
                    >
                      {isFree ? 'Lecture seule' : 'Annuler'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Read-only Community & Messaging */}
        {!isBrand && (
          <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
              Communauté & Messagerie
            </h2>
            {isFree ? (
              <div className="p-6 rounded border" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
                <p style={{ color: 'var(--text-color)', opacity: 0.8 }} className="mb-2">
                  Accès lecture seule à l'espace communauté.
                </p>
                <ul className="text-sm space-y-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  <li>✅ Consulter les annonces de collaborations</li>
                  <li>✅ Lire les échanges communautaires</li>
                  <li>❌ Pas de candidature</li>
                  <li>❌ Pas de messagerie</li>
                  <li>❌ Pas de publication de contenu</li>
                </ul>
                <div className="mt-4 flex gap-3">
                  <button
                    className="px-4 py-2 rounded font-semibold text-white"
                    style={{ backgroundColor: 'var(--primary-color)' }}
                  >
                    Passer Premium
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-lg p-5 border" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-color)' }}>🗣️ Communauté Premium</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {communityPosts.map((post) => (
                      <div key={post.id} className="p-4 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--background-color) 70%, transparent)' }}>
                        <p className="text-xs uppercase" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{post.topic}</p>
                        <p className="font-semibold mt-1" style={{ color: 'var(--text-color)' }}>{post.title}</p>
                        <p className="text-xs mt-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>{post.replies} réponses</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button
                      className="px-4 py-2 rounded font-semibold text-white"
                      style={{ backgroundColor: 'var(--primary-color)' }}
                    >
                      Publier
                    </button>
                    <button
                      className="px-4 py-2 rounded font-semibold"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)', color: 'var(--text-color)' }}
                    >
                      Commenter
                    </button>
                  </div>
                </div>
                <div className="rounded-lg p-5 border" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
                  <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-color)' }}>💬 Messagerie privée</h3>
                  <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                    Connexion directe mannequin ↔ marque et mannequin ↔ mannequin.
                  </p>
                  <div className="mt-4 rounded-lg p-4" style={{ backgroundColor: 'color-mix(in srgb, var(--background-color) 70%, transparent)' }}>
                    <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Aucune conversation active pour le moment.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Brand Messaging & Limitations */}
        {isBrand && (
          <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>💬 Messagerie Premium</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded border" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
                <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                  Contact direct avec les profils Premium.
                </p>
                <button
                  className="mt-4 px-4 py-2 rounded font-semibold text-white"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  Démarrer une conversation
                </button>
              </div>
              <div className="p-5 rounded border" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-color)' }}>Limitations</h3>
                <ul className="text-sm space-y-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  <li>❌ Pas de publication de posts</li>
                  <li>❌ Pas d’accès à la communauté</li>
                  <li>❌ Pas d’interaction sociale entre marques</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Publications (Premium) */}
        {!isFree && !isBrand && (
          <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>📰 Publications sur votre profil</h2>
              <button
                className="px-4 py-2 rounded font-semibold text-white"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                Nouvelle publication
              </button>
            </div>
            <div className="space-y-4">
              {publications.map((pub) => (
                <div key={pub.id} className="p-5 rounded border" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold" style={{ color: 'var(--text-color)' }}>{pub.title}</p>
                      <p className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{pub.type}</p>
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Visible sur votre profil</span>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{pub.content}</p>
                  <div className="mt-3 flex gap-4 text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                    <span>❤️ {pub.likes}</span>
                    <span>💬 {pub.comments}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collaborations (Premium) */}
        {!isFree && !isBrand && (
          <div className="mb-12 p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>🤝 Collaborations</h2>
              <button
                className="px-4 py-2 rounded font-semibold text-white"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                Postuler à un projet
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded border" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-color)' }}>Historique des candidatures</h3>
                <div className="space-y-3">
                  {collaborationHistory.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                      <span>{item.project}</span>
                      <span>{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-5 rounded border" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--text-color)' }}>Notifications</h3>
                <div className="space-y-3">
                  {notifications.map((note) => (
                    <div key={note.id} className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                      • {note.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Request */}
        {!isBrand && (
          <div className="p-8 rounded-lg" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Demander une Fonctionnalité</h2>
            {isFree ? (
              <div className="p-6 rounded border" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}>
                <p style={{ color: 'var(--text-color)', opacity: 0.8 }} className="mb-2 text-sm">
                  Fonctionnalité réservée aux comptes Premium. Passez Premium pour soumettre une demande.
                </p>
                <button
                  className="px-4 py-2 rounded font-semibold text-white"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  Passer Premium
                </button>
              </div>
            ) : (
              <>
                <p style={{ color: 'var(--text-color)', opacity: 0.8 }} className="mb-6 text-sm">
                  Avez-vous une idée pour améliorer la plateforme? Utilisez notre IA pour proposer une fonctionnalité qui sera examinée par nos modérateurs.
                </p>
                <textarea
                  value={featureRequest}
                  onChange={(e) => setFeatureRequest(e.target.value)}
                  placeholder="Décrivez votre idée de fonctionnalité..."
                  className="w-full p-4 rounded mb-4 bg-black text-white border focus:outline-none focus:ring-2"
                  style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)', focusRingColor: 'var(--primary-color)' }}
                  rows={5}
                />
                <button
                  className="w-full py-3 rounded font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                  onClick={handleSubmitFeatureRequest}
                >
                  Soumettre la Demande via IA
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
