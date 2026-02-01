import React, { useState, useEffect } from 'react';
import {
  userAPI,
  subscriptionAPI,
  campaignAPI,
  featureRequestAPI,
  communityAPI,
} from '../../api/endpoints';
import { useAuthStore } from '../../store';

const CATEGORY_LABELS = {
  platform_ui_ux: 'UI/UX',
  community_complaints: 'Plaintes',
  feature_requests: 'Demandes',
};

const SERVICES = [
  { id: 1, name: 'API Stripe', status: 'active', latency: '45ms', uptime: '99.9%' },
  { id: 2, name: 'Email Service', status: 'active', latency: '120ms', uptime: '99.8%' },
  { id: 3, name: 'Storage Cloud', status: 'active', latency: '80ms', uptime: '99.95%' },
  { id: 4, name: 'Analytics API', status: 'active', latency: '60ms', uptime: '99.7%' },
];

export default function SalesforceAdminDashboard() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    activeUsers: 0,
    subscriptions: 0,
    campaigns: 0,
    pendingVettings: 0,
  });
  const [platformStats, setPlatformStats] = useState({
    uptime: '99.95%',
    avgLatency: '76ms',
    totalRequests: '2.4M',
    errorRate: '0.05%',
  });
  const [userInteractions, setUserInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [featureRequests, setFeatureRequests] = useState([]);
  const [aiPrompts, setAiPrompts] = useState([]);
  const [communityId, setCommunityId] = useState(null);
  const [categoryInsights, setCategoryInsights] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const generateAIPrompt = (featureRequest) => {
    const timestamp = new Date().toLocaleString();
    return {
      id: `ai-${featureRequest.id}`,
      featureRequestId: featureRequest.id,
      originalRequest: featureRequest.title,
      analysis: `Analyze this feature request submitted by user: "${featureRequest.title}". Description: ${featureRequest.description}. Priority: ${featureRequest.priority}`,
      prompt: `As a product development AI, analyze and convert the following feature request into implementation-ready specifications:\n\nFeature: ${featureRequest.title}\nDescription: ${featureRequest.description}\nPriority Level: ${featureRequest.priority}\n\nProvide: 1) Core Requirements, 2) Technical Approach, 3) Implementation Steps, 4) Success Metrics`,
      status: 'ready',
      createdAt: timestamp,
      fromUser: featureRequest.user_id,
    };
  };

  const fetchDashboardData = async () => {
    try {
      const [usersRes, plansRes, subscriptionsRes, campaignsRes, featureRes, communitiesRes] = await Promise.all([
        userAPI.getUsers().catch(() => ({ data: [] })),
        subscriptionAPI.getPlans().catch(() => ({ data: [] })),
        subscriptionAPI.getSubscriptions().catch(() => ({ data: [] })),
        campaignAPI.getCampaigns().catch(() => ({ data: [] })),
        featureRequestAPI.getAll().catch(() => ({ data: [] })),
        communityAPI.getCommunities().catch(() => ({ data: [] })),
      ]);

      const usersData = usersRes.data || [];
      const plansData = plansRes.data || [];
      const subscriptionsData = subscriptionsRes.data || [];
      const campaignsData = campaignsRes.data || [];
      const featureData = featureRes.data || [];
      const communitiesData = communitiesRes.data || [];

      setUsers(usersData);
      setPlans(plansData);
      setSubscriptions(subscriptionsData);
      setCampaigns(campaignsData);
      setFeatureRequests(featureData);

      // Generate AI prompts for all unprocessed feature requests
      const generatedPrompts = featureData.map((fr) => generateAIPrompt(fr));
      setAiPrompts(generatedPrompts);

      // Simulate user interactions based on subscriptions and activities
      const interactions = usersData.slice(0, 8).map((u) => ({
        userId: u.id,
        userName: u.full_name,
        action: ['viewed_platform', 'submitted_request', 'joined_community', 'subscribed_plan'][Math.floor(Math.random() * 4)],
        timestamp: new Date(Date.now() - Math.random() * 86400000).toLocaleString(),
        status: ['success', 'pending', 'completed'][Math.floor(Math.random() * 3)],
      }));
      setUserInteractions(interactions);

      const activeUsers = usersData.filter((u) => u.is_active).length;
      const pendingVettings = featureData.filter((request) => request.status !== 'approved').length;

      setStats({
        activeUsers,
        subscriptions: subscriptionsData.length,
        campaigns: campaignsData.length,
        pendingVettings,
      });

      const selectedCommunity = communitiesData[0];
      if (selectedCommunity) {
        setCommunityId(selectedCommunity.id);
        const categories = Object.keys(CATEGORY_LABELS);
        const categoryResponses = await Promise.all(
          categories.map((category) => communityAPI.getQuestions(selectedCommunity.id, category).catch(() => ({ data: [] })))
        );
        const insights = categories.map((category, index) => ({
          category,
          label: CATEGORY_LABELS[category],
          count: categoryResponses[index].data?.length || 0,
        }));
        setCategoryInsights(insights);
      } else {
        setCategoryInsights([]);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCampaignStatus = async (campaignId, status) => {
    try {
      await campaignAPI.updateCampaign(campaignId, { status });
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const handleVetting = async (requestId, status) => {
    try {
      await featureRequestAPI.update(requestId, { status });
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to update request:', error);
    }
  };

  const planMap = plans.reduce((acc, plan) => {
    acc[plan.id] = plan;
    return acc;
  }, {});

  const subscriptionOverview = subscriptions.reduce((acc, sub) => {
    const plan = planMap[sub.plan_id];
    const key = sub.plan_id;
    if (!acc[key]) {
      acc[key] = {
        id: sub.plan_id,
        name: plan?.name || `Plan ${sub.plan_id}`,
        activeUsers: 0,
        status: 'active',
      };
    }
    if (sub.status === 'active' || sub.status === 'paid') {
      acc[key].activeUsers += 1;
    }
    return acc;
  }, {});

  const subscriptionCards = Object.values(subscriptionOverview);

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>
            ✨ Bienvenue {user?.full_name}, Admin Plateforme
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
            Contrôlez tout, gérez les privilèges, supervisez les performances et analysez les demandes avec l'IA
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 20%, transparent)' }}>
          <div className="flex gap-8 overflow-x-auto">
            {['overview', 'performance', 'interactions', 'integrations', 'ai-analysis'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-4 py-3 font-semibold border-b-2 whitespace-nowrap transition"
                style={{
                  borderColor: activeTab === tab ? 'var(--primary-color)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary-color)' : 'var(--text-color)',
                  opacity: activeTab === tab ? 1 : 0.7,
                }}
              >
                {tab === 'overview' && '📊 Aperçu'}
                {tab === 'performance' && '⚡ Performance'}
                {tab === 'interactions' && '👥 Interactions'}
                {tab === 'integrations' && '🔌 Services'}
                {tab === 'ai-analysis' && '🤖 IA Analyse'}
              </button>
            ))}
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div
                className="rounded-lg p-6 border-l-4 shadow-sm hover:shadow-md transition"
                style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
              >
                <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Utilisateurs Actifs
                </h3>
                <p className="text-4xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.activeUsers}</p>
                <div className="mt-4 w-full rounded h-2" style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 20%, transparent)' }}>
                  <div className="h-2 rounded" style={{ width: '85%', backgroundColor: 'var(--primary-color)' }}></div>
                </div>
              </div>
              <div
                className="rounded-lg p-6 border-l-4 shadow-sm hover:shadow-md transition"
                style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
              >
                <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Abonnements
                </h3>
                <p className="text-4xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.subscriptions}</p>
                <p className="text-sm mt-2 font-semibold" style={{ color: 'var(--primary-color)' }}>Suivi des plans actifs</p>
              </div>
              <div
                className="rounded-lg p-6 border-l-4 shadow-sm hover:shadow-md transition"
                style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
              >
                <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Campagnes Actives
                </h3>
                <p className="text-4xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.campaigns}</p>
                <p className="text-sm mt-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Marketing & digital</p>
              </div>
              <div
                className="rounded-lg p-6 border-l-4 shadow-sm hover:shadow-md transition"
                style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
              >
                <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Vettings en attente
                </h3>
                <p className="text-4xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.pendingVettings}</p>
                <button className="mt-4 text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>
                  Examiner
                </button>
              </div>
            </div>

            {/* User Management */}
            <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                👤 Gestion des Utilisateurs & Privilèges
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 20%, transparent)' }}>
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Nom</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Email</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Rôle</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Statut</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)' }}>
                        <td className="py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)' }}>{u.full_name}</td>
                        <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{u.email}</td>
                        <td className="py-3 px-4 text-sm">
                          <select
                            defaultValue={u.role_id}
                            className="rounded px-2 py-1"
                            style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)', color: 'var(--text-color)' }}
                          >
                            <option value={1}>System Admin</option>
                            <option value={2}>Community Admin</option>
                            <option value={3}>Moderator</option>
                            <option value={4}>User</option>
                            <option value={5}>Guest</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <span style={{ color: u.is_active ? '#22c55e' : '#ef4444' }}>
                            {u.is_active ? '🟢 Actif' : '🔴 Inactif'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <button style={{ color: 'var(--primary-color)' }} className="mr-3">
                            Éditer
                          </button>
                          <button style={{ color: '#ef4444' }}>
                            Désactiver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Community Insights */}
            <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
                  Dashboard Communautaire
                </h2>
                <span className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Communauté active: {communityId || '—'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categoryInsights.map((insight) => (
                  <div key={insight.category} className="p-6 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)' }}>
                    <p className="text-sm uppercase" style={{ color: 'var(--text-color)', opacity: 0.7 }}>{insight.label}</p>
                    <p className="text-3xl font-bold" style={{ color: 'var(--text-color)' }}>{insight.count}</p>
                    <p className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Questions actives</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscriptions Management */}
            <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                💳 Gestion des Abonnements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionCards.slice(0, 3).map((card) => (
                  <div
                    key={card.id}
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 80%, transparent)', border: '1px solid color-mix(in srgb, var(--primary-color) 35%, transparent)' }}
                  >
                    <h3 className="font-bold mb-4 text-lg" style={{ color: 'var(--text-color)' }}>{card.name}</h3>
                    <div className="text-3xl font-bold mb-4" style={{ color: 'var(--primary-color)' }}>{card.activeUsers}</div>
                    <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Abonnés actifs</p>
                    <button
                      className="mt-4 w-full py-2 rounded font-semibold"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 15%, transparent)', color: 'var(--primary-color)' }}
                    >
                      Gérer
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaigns */}
            <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                📢 Campagnes Marketing
              </h2>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className="p-4 border rounded-lg hover:shadow-md transition"
                    style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-2">
                      <div>
                        <h3 className="font-semibold" style={{ color: 'var(--text-color)' }}>{campaign.name}</h3>
                        <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                          {campaign.channel} • Objectif: {campaign.objective || '—'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded text-xs font-semibold" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 20%, transparent)', color: 'var(--primary-color)' }}>
                        {campaign.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                      <div>Budget: €{campaign.budget}</div>
                      <div>Spend: €{campaign.spend}</div>
                      <div>Clicks: {campaign.clicks}</div>
                      <div>Conversions: {campaign.conversions}</div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        className="text-sm font-semibold"
                        style={{ color: 'var(--primary-color)' }}
                        onClick={() => handleUpdateCampaignStatus(campaign.id, 'active')}
                      >
                        Activer
                      </button>
                      <button
                        className="text-sm font-semibold"
                        style={{ color: 'var(--text-color)', opacity: 0.7 }}
                        onClick={() => handleUpdateCampaignStatus(campaign.id, 'paused')}
                      >
                        Mettre en pause
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vetting */}
            <div className="rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--secondary-color)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                ✅ Demandes de Vetting
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 20%, transparent)' }}>
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Titre</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Soumis par</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Priorité</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {featureRequests.slice(0, 6).map((request) => (
                      <tr
                        key={request.id}
                        className="border-b"
                        style={{ borderColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)' }}
                      >
                        <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)' }}>{request.title}</td>
                        <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                          {users.find((u) => u.id === request.user_id)?.full_name || `User ${request.user_id}`}
                        </td>
                        <td className="py-3 px-4 text-sm" style={{ color: 'var(--primary-color)' }}>{request.priority}</td>
                        <td className="py-3 px-4 text-sm">
                          <button className="text-green-600 hover:text-green-800 font-semibold mr-4" onClick={() => handleVetting(request.id, 'approved')}>
                            Approuver
                          </button>
                          <button className="text-red-600 hover:text-red-800 font-semibold" onClick={() => handleVetting(request.id, 'rejected')}>
                            Rejeter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === 'performance' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div
                className="rounded-lg p-6 border-l-4 shadow-sm"
                style={{ backgroundColor: 'var(--secondary-color)', borderColor: '#22c55e' }}
              >
                <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Uptime Plateforme
                </h3>
                <p className="text-4xl font-bold" style={{ color: '#22c55e' }}>{platformStats.uptime}</p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Dernière vérification</p>
              </div>
              <div
                className="rounded-lg p-6 border-l-4 shadow-sm"
                style={{ backgroundColor: 'var(--secondary-color)', borderColor: '#3b82f6' }}
              >
                <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Latence Moyenne
                </h3>
                <p className="text-4xl font-bold" style={{ color: '#3b82f6' }}>{platformStats.avgLatency}</p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Temps de réponse</p>
              </div>
              <div
                className="rounded-lg p-6 border-l-4 shadow-sm"
                style={{ backgroundColor: 'var(--secondary-color)', borderColor: '#a855f7' }}
              >
                <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Requêtes Totales
                </h3>
                <p className="text-4xl font-bold" style={{ color: '#a855f7' }}>{platformStats.totalRequests}</p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Dernières 24h</p>
              </div>
              <div
                className="rounded-lg p-6 border-l-4 shadow-sm"
                style={{ backgroundColor: 'var(--secondary-color)', borderColor: '#ef4444' }}
              >
                <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Taux d'Erreur
                </h3>
                <p className="text-4xl font-bold" style={{ color: '#ef4444' }}>{platformStats.errorRate}</p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Infractions</p>
              </div>
            </div>

            <div className="rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--secondary-color)' }}>
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
                Graphique de Performance (24h)
              </h2>
              <div className="h-40 bg-gradient-to-t rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 10%, transparent)' }}>
                <div className="w-full h-full flex items-end justify-around px-4">
                  {[65, 78, 82, 75, 88, 92, 85, 90].map((val, i) => (
                    <div key={i} className="flex flex-col items-center gap-2">
                      <div style={{ height: `${val}%`, width: '30px', backgroundColor: 'var(--primary-color)', borderRadius: '4px' }}></div>
                      <span className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{i * 3}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USER INTERACTIONS TAB */}
        {activeTab === 'interactions' && (
          <div className="rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--secondary-color)' }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
              👥 Gestionnaire d'Interactions Utilisateurs
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 20%, transparent)' }}>
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Utilisateur</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Action</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Timestamp</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {userInteractions.map((interaction, idx) => (
                    <tr
                      key={idx}
                      className="border-b hover:bg-opacity-50 transition"
                      style={{ borderColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)', backgroundColor: 'color-mix(in srgb, var(--text-color) 2%, transparent)' }}
                    >
                      <td className="py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)' }}>{interaction.userName}</td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                        {interaction.action === 'viewed_platform' && '👁️ Consulté plateforme'}
                        {interaction.action === 'submitted_request' && '📝 Demande soumise'}
                        {interaction.action === 'joined_community' && '👥 Rejoint communauté'}
                        {interaction.action === 'subscribed_plan' && '💳 Plan souscrit'}
                      </td>
                      <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>{interaction.timestamp}</td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className="px-3 py-1 rounded text-xs font-semibold"
                          style={{
                            backgroundColor: interaction.status === 'success' ? 'color-mix(in srgb, #22c55e 20%, transparent)' : 'color-mix(in srgb, var(--primary-color) 20%, transparent)',
                            color: interaction.status === 'success' ? '#22c55e' : 'var(--primary-color)',
                          }}
                        >
                          {interaction.status === 'success' && '✓ Succès'}
                          {interaction.status === 'pending' && '⏳ En attente'}
                          {interaction.status === 'completed' && '✅ Terminé'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* INTEGRATIONS TAB */}
        {activeTab === 'integrations' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
              🔌 Services et Intégrations Externes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SERVICES.map((service) => (
                <div
                  key={service.id}
                  className="rounded-lg p-6 shadow-sm"
                  style={{ backgroundColor: 'var(--secondary-color)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>{service.name}</h3>
                    <span
                      className="px-3 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: service.status === 'active' ? 'color-mix(in srgb, #22c55e 20%, transparent)' : 'color-mix(in srgb, #f59e0b 20%, transparent)',
                        color: service.status === 'active' ? '#22c55e' : '#f59e0b',
                      }}
                    >
                      {service.status === 'active' ? '🟢 Actif' : '🟡 Maintenance'}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>Latence:</span>
                      <span style={{ color: 'var(--text-color)' }}>{service.latency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--text-color)', opacity: 0.7 }}>Uptime:</span>
                      <span style={{ color: 'var(--text-color)' }}>{service.uptime}</span>
                    </div>
                  </div>
                  <button
                    className="w-full py-2 rounded text-sm font-semibold"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 15%, transparent)', color: 'var(--primary-color)' }}
                  >
                    Configurer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI ANALYSIS TAB */}
        {activeTab === 'ai-analysis' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
              🤖 Analyse IA des Demandes de Fonctionnalités
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {aiPrompts.slice(0, 5).map((prompt) => (
                <div
                  key={prompt.id}
                  className="rounded-lg p-6 shadow-sm"
                  style={{ backgroundColor: 'var(--secondary-color)' }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>
                        {prompt.originalRequest}
                      </h3>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                        Soumis par: Utilisateur #{prompt.fromUser}
                      </p>
                    </div>
                    <span
                      className="px-3 py-1 rounded text-xs font-semibold whitespace-nowrap"
                      style={{
                        backgroundColor: 'color-mix(in srgb, #a855f7 20%, transparent)',
                        color: '#a855f7',
                      }}
                    >
                      {prompt.status === 'ready' && '✓ Prêt'}
                    </span>
                  </div>
                  <div className="mb-4 p-4 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 5%, transparent)' }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>Analyse:</p>
                    <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                      {prompt.analysis}
                    </p>
                  </div>
                  <div className="mb-4 p-4 rounded border" style={{ borderColor: 'color-mix(in srgb, var(--primary-color) 30%, transparent)', backgroundColor: 'color-mix(in srgb, var(--primary-color) 5%, transparent)' }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: 'var(--text-color)' }}>Prompt IA Généré:</p>
                    <p className="text-sm whitespace-pre-line" style={{ color: 'var(--text-color)', opacity: 0.85, fontFamily: 'monospace', fontSize: '11px' }}>
                      {prompt.prompt}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="px-4 py-2 rounded text-sm font-semibold"
                      style={{ backgroundColor: 'color-mix(in srgb, #22c55e 20%, transparent)', color: '#22c55e' }}
                    >
                      Utiliser
                    </button>
                    <button
                      className="px-4 py-2 rounded text-sm font-semibold"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)', color: 'var(--text-color)' }}
                    >
                      Copier Prompt
                    </button>
                    <button
                      className="px-4 py-2 rounded text-sm font-semibold"
                      style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)', color: 'var(--text-color)' }}
                    >
                      Exporter
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
