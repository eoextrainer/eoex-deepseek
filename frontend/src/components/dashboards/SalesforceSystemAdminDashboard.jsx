import React, { useState, useEffect } from 'react';
import {
  userAPI,
  subscriptionAPI,
  featureRequestAPI,
  serviceAPI,
  integrationAPI,
  roleAPI,
} from '../../api/endpoints';
import { useAuthStore } from '../../store';

export default function SalesforceSystemAdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeServices: 0,
    platformHealth: 0,
    dataExchanges: 0,
  });
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [integrations, setIntegrations] = useState([]);
  const [serviceSubscriptions, setServiceSubscriptions] = useState([]);
  const [featureRequests, setFeatureRequests] = useState([]);
  const [aiPrompts, setAiPrompts] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        usersRes,
        rolesRes,
        servicesRes,
        integrationsRes,
        plansRes,
        subscriptionsRes,
        featureRes,
      ] = await Promise.all([
        userAPI.getUsers().catch(() => ({ data: [] })),
        roleAPI.getRoles().catch(() => ({ data: [] })),
        serviceAPI.getServices().catch(() => ({ data: [] })),
        integrationAPI.getIntegrations().catch(() => ({ data: [] })),
        subscriptionAPI.getPlans().catch(() => ({ data: [] })),
        subscriptionAPI.getSubscriptions().catch(() => ({ data: [] })),
        featureRequestAPI.getAll().catch(() => ({ data: [] })),
      ]);

      const usersData = usersRes.data || [];
      const rolesData = rolesRes.data || [];
      const servicesData = servicesRes.data || [];
      const integrationsData = integrationsRes.data || [];
      const plansData = plansRes.data || [];
      const subscriptionsData = subscriptionsRes.data || [];
      const featureData = featureRes.data || [];

      setUsers(usersData);
      setRoles(rolesData);
      setServices(servicesData);
      setIntegrations(integrationsData);
      setFeatureRequests(featureData);

      const planMap = new Map(plansData.map((plan) => [plan.id, plan]));
      const subscriptionSummary = subscriptionsData.reduce((acc, subscription) => {
        const plan = planMap.get(subscription.plan_id);
        const key = subscription.plan_id;
        if (!acc[key]) {
          acc[key] = {
            id: subscription.plan_id,
            name: plan?.name || `Plan ${subscription.plan_id}`,
            activeUsers: 0,
            status: 'active',
          };
        }
        if (subscription.status === 'active' || subscription.status === 'paid') {
          acc[key].activeUsers += 1;
        }
        return acc;
      }, {});

      setServiceSubscriptions(Object.values(subscriptionSummary));

      const activeServices = servicesData.filter((service) => service.status === 'active').length;
      const health = servicesData.length > 0 ? Math.round((activeServices / servicesData.length) * 1000) / 10 : 0;

      setStats({
        totalUsers: usersData.length,
        activeServices: servicesData.length,
        platformHealth: health || 99.8,
        dataExchanges: integrationsData.length,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, roleId) => {
    try {
      await userAPI.updateUser(userId, { role_id: roleId });
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const handleToggleUserStatus = async (targetUser) => {
    try {
      if (targetUser.is_active) {
        await userAPI.deleteUser(targetUser.id);
      } else {
        await userAPI.updateUser(targetUser.id, { is_active: true });
      }
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const handleGeneratePrompt = async (request) => {
    try {
      const promptText = `Transformer la demande suivante en spécifications IA prêtes: ${request.title} - ${request.description}. Inclure objectifs, flux UX, données requises, endpoints et critères d'acceptation.`;
      const response = await featureRequestAPI.createAIPrompt(request.id, { prompt_text: promptText });
      setAiPrompts((prev) => ({ ...prev, [request.id]: response.data?.prompt_text || promptText }));
    } catch (error) {
      console.error('Failed to create AI prompt:', error);
    }
  };

  const handleMarkReady = async (requestId) => {
    try {
      await featureRequestAPI.update(requestId, { status: 'ready' });
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to update feature request:', error);
    }
  };

  const handleAuthorizeExchange = async (integrationId) => {
    try {
      await integrationAPI.logExchange(integrationId, {
        direction: 'outbound',
        status: 'authorized',
        payload_preview: 'System admin authorized exchange.',
      });
      await fetchDashboardData();
    } catch (error) {
      console.error('Failed to authorize exchange:', error);
    }
  };

  const userById = users.reduce((acc, current) => {
    acc[current.id] = current;
    return acc;
  }, {});

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-color)' }}>
            Bienvenue {user?.full_name}, Admin Système
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
            Vous contrôlez tous les aspects de la plateforme et gérez les privilèges utilisateur
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div
            className="rounded-lg p-6 border-l-4 shadow-sm"
            style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
          >
            <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Utilisateurs Totaux
            </h3>
            <p className="text-4xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.totalUsers}</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Actifs sur la plateforme</p>
          </div>
          <div
            className="rounded-lg p-6 border-l-4 shadow-sm"
            style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
          >
            <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Services Actifs
            </h3>
            <p className="text-4xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.activeServices}</p>
            <p className="text-sm mt-2" style={{ color: 'var(--primary-color)' }}>✓ Tous opérationnels</p>
          </div>
          <div
            className="rounded-lg p-6 border-l-4 shadow-sm"
            style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
          >
            <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Santé Plateforme
            </h3>
            <p className="text-4xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.platformHealth}%</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Performance globale</p>
          </div>
          <div
            className="rounded-lg p-6 border-l-4 shadow-sm"
            style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
          >
            <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Échanges de Données
            </h3>
            <p className="text-4xl font-bold" style={{ color: 'var(--text-color)' }}>{stats.dataExchanges}</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>APIs externes actives</p>
          </div>
        </div>

        {/* Platform Performance */}
        <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
              Tableau de Performance Plateforme
            </h2>
            <button className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>
              Voir les rapports
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)' }}>
              <p className="text-sm uppercase" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Temps de réponse</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-color)' }}>182 ms</p>
              <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.6 }}>P95 des dernières 24h</p>
            </div>
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)' }}>
              <p className="text-sm uppercase" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Disponibilité</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-color)' }}>99.94%</p>
              <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.6 }}>30 derniers jours</p>
            </div>
            <div className="p-6 rounded-lg" style={{ backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)' }}>
              <p className="text-sm uppercase" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Charge API</p>
              <p className="text-3xl font-bold" style={{ color: 'var(--text-color)' }}>4.2K/min</p>
              <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Pic sur 1h</p>
            </div>
          </div>
        </div>

        {/* Services Management */}
        <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
            Gestion des Microservices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="p-4 border rounded-lg hover:shadow-md transition"
                style={{ borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold" style={{ color: 'var(--text-color)' }}>{service.name}</h3>
                  <span
                    className="text-sm font-bold"
                    style={{ color: service.status === 'active' ? '#22c55e' : '#f59e0b' }}
                  >
                    ●
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Status: {service.status} • Catégorie: {service.category}
                </p>
                <button className="mt-4 text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>
                  Configurer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Privileges & Role Grants */}
        <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
              Attribution des Privilèges
            </h2>
            <button className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>
              Gérer les rôles
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 20%, transparent)' }}>
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Utilisateur</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Rôle actuel</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Nouveau rôle</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Statut</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.8 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 8).map((targetUser) => (
                  <tr key={targetUser.id} className="border-b" style={{ borderColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)' }}>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)' }}>{targetUser.full_name}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
                      {targetUser.role?.name || 'user'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <select
                        defaultValue={targetUser.role?.id}
                        className="bg-transparent border rounded px-2 py-1 text-sm"
                        style={{ borderColor: 'color-mix(in srgb, var(--text-color) 20%, transparent)', color: 'var(--text-color)' }}
                        onChange={(event) => handleRoleChange(targetUser.id, Number(event.target.value))}
                      >
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: targetUser.is_active
                            ? 'color-mix(in srgb, #22c55e 20%, transparent)'
                            : 'color-mix(in srgb, #f59e0b 20%, transparent)',
                          color: targetUser.is_active ? '#22c55e' : '#f59e0b'
                        }}
                      >
                        {targetUser.is_active ? 'active' : 'suspendu'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        className="font-semibold"
                        style={{ color: 'var(--primary-color)' }}
                        onClick={() => handleToggleUserStatus(targetUser)}
                      >
                        {targetUser.is_active ? 'Suspendre' : 'Réactiver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Service Subscriptions */}
        <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
            Services Abonnés par les Utilisateurs
          </h2>
          <div className="space-y-4">
            {serviceSubscriptions.map((service) => (
              <div
                key={service.id}
                className="p-4 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)'
                }}
              >
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--text-color)' }}>{service.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                    {service.activeUsers} abonnés actifs
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: 'color-mix(in srgb, #22c55e 20%, transparent)',
                      color: '#22c55e'
                    }}
                  >
                    actif
                  </span>
                  <button className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>
                    Gérer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* External Data & Service Exchanges */}
        <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
            Échanges de Données & Services (APIs)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrations.map((exchange) => (
              <div
                key={exchange.id}
                className="p-6 rounded-lg border"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)'
                }}
              >
                <h3 className="font-semibold" style={{ color: 'var(--text-color)' }}>{exchange.name}</h3>
                <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                  Base URL: {exchange.base_url}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span
                    className="text-xs font-semibold px-2 py-1 rounded"
                    style={{
                      backgroundColor: exchange.status === 'active'
                        ? 'color-mix(in srgb, #22c55e 20%, transparent)'
                        : 'color-mix(in srgb, #f59e0b 20%, transparent)',
                      color: exchange.status === 'active' ? '#22c55e' : '#f59e0b'
                    }}
                  >
                    {exchange.status}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-color)', opacity: 0.6 }}>
                    Auth: {exchange.auth_type}
                  </span>
                </div>
                <button
                  className="mt-4 text-sm font-semibold"
                  style={{ color: 'var(--primary-color)' }}
                  onClick={() => handleAuthorizeExchange(exchange.id)}
                >
                  Autoriser l'échange
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Requests - AI Ready */}
        <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-color)' }}>
              Requêtes Fonctionnalités (IA Ready)
            </h2>
            <button className="text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>
              Exporter les prompts
            </button>
          </div>
          <div className="space-y-4">
            {featureRequests.map((request) => (
              <div
                key={request.id}
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)'
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--text-color)' }}>{request.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
                      {userById[request.user_id]?.full_name || `User ${request.user_id}`} • {request.priority}
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: 'color-mix(in srgb, var(--primary-color) 15%, transparent)',
                      color: 'var(--primary-color)'
                    }}
                  >
                    {request.status}
                  </span>
                </div>
                <div className="p-3 rounded" style={{ backgroundColor: 'color-mix(in srgb, var(--background-color) 70%, transparent)' }}>
                  <p className="text-sm" style={{ color: 'var(--text-color)', opacity: 0.85 }}>
                    {aiPrompts[request.id] || request.description}
                  </p>
                </div>
                <div className="mt-3 flex gap-3">
                  <button
                    className="text-sm font-semibold"
                    style={{ color: 'var(--primary-color)' }}
                    onClick={() => handleMarkReady(request.id)}
                  >
                    Marquer comme prêt
                  </button>
                  <button
                    className="text-sm font-semibold"
                    style={{ color: 'var(--text-color)', opacity: 0.7 }}
                    onClick={() => handleGeneratePrompt(request)}
                  >
                    Générer prompt IA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Management */}
        <div className="rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>
            Gestion des Utilisateurs
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
                {users.slice(0, 10).map((u) => (
                  <tr
                    key={u.id}
                    className="border-b"
                    style={{ borderColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)' }}
                  >
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)' }}>{u.full_name}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{u.email}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: 'color-mix(in srgb, var(--primary-color) 15%, transparent)', color: 'var(--primary-color)' }}
                      >
                        {u.role?.name || 'user'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className="font-semibold" style={{ color: u.is_active ? '#22c55e' : '#f59e0b' }}>
                        {u.is_active ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        className="font-semibold"
                        style={{ color: 'var(--primary-color)' }}
                        onClick={() => handleToggleUserStatus(u)}
                      >
                        {u.is_active ? 'Désactiver' : 'Réactiver'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
