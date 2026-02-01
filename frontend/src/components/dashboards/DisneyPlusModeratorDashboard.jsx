import React, { useState, useEffect } from 'react';
import {
  opportunityAPI,
  issueAPI,
  communityAPI,
  impersonationAPI,
  userAPI,
} from '../../api/endpoints';
import { useAuthStore } from '../../store';

const QUESTION_CATEGORIES = [
  { id: 'platform_ui_ux', label: 'UI/UX Feedback' },
  { id: 'community_complaints', label: 'Community Complaints' },
  { id: 'feature_requests', label: 'Feature Requests' },
];

export default function DisneyPlusModeratorDashboard() {
  const { user } = useAuthStore();
  const [selectedTier, setSelectedTier] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [impersonatingUser, setImpersonatingUser] = useState(null);
  const [impersonationRecord, setImpersonationRecord] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [issues, setIssues] = useState([]);
  const [forumQuestions, setForumQuestions] = useState([]);
  const [communityId, setCommunityId] = useState(null);
  const [users, setUsers] = useState([]);
  const [happinessScore, setHappinessScore] = useState(92);

  useEffect(() => {
    fetchModeratorData();
  }, [selectedTier, selectedCategory]);

  const fetchModeratorData = async () => {
    try {
      const [communitiesRes, opportunitiesRes, issuesRes, usersRes] = await Promise.all([
        communityAPI.getCommunities().catch(() => ({ data: [] })),
        opportunityAPI.getOpportunities(selectedTier === 'all' ? undefined : selectedTier, selectedCategory === 'all' ? undefined : selectedCategory).catch(() => ({ data: [] })),
        issueAPI.getAll().catch(() => ({ data: [] })),
        userAPI.getUsers().catch(() => ({ data: [] })),
      ]);

      const community = communitiesRes.data?.[0];
      const communityIdentifier = community?.id || null;
      setCommunityId(communityIdentifier);
      setOpportunities(opportunitiesRes.data || []);
      setIssues(issuesRes.data || []);
      setUsers(usersRes.data?.filter((target) => target.role?.name !== 'system_admin') || []);

      if (communityIdentifier) {
        const questionResponses = await Promise.all(
          QUESTION_CATEGORIES.map((category) => communityAPI.getQuestions(communityIdentifier, category.id).catch(() => ({ data: [] })))
        );
        const mappedQuestions = QUESTION_CATEGORIES.flatMap((category, index) =>
          (questionResponses[index].data || []).map((question) => ({
            ...question,
            categoryLabel: category.label,
          }))
        );
        setForumQuestions(mappedQuestions);
      } else {
        setForumQuestions([]);
      }

      const openIssues = (issuesRes.data || []).filter((issue) => issue.status !== 'resolved').length;
      const totalIssues = issuesRes.data?.length || 1;
      const calculatedHappiness = Math.max(60, Math.round(100 - (openIssues / totalIssues) * 40));
      setHappinessScore(calculatedHappiness);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleIssueStatus = async (issueId, status) => {
    try {
      await issueAPI.update(issueId, { status });
      await fetchModeratorData();
    } catch (error) {
      console.error('Failed to update issue:', error);
    }
  };

  const handleImpersonate = async (target) => {
    try {
      const response = await impersonationAPI.start({
        impersonated_user_id: target.id,
        reason: 'Audit expérience utilisateur',
      });
      setImpersonationRecord(response.data);
      setImpersonatingUser(target);
    } catch (error) {
      console.error('Failed to impersonate:', error);
    }
  };

  const handleStopImpersonation = async () => {
    if (!impersonationRecord) {
      setImpersonatingUser(null);
      return;
    }
    try {
      await impersonationAPI.end(impersonationRecord.id);
      setImpersonationRecord(null);
      setImpersonatingUser(null);
    } catch (error) {
      console.error('Failed to end impersonation:', error);
    }
  };

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: 'var(--background-color)', color: 'var(--text-color)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Impersonation Banner */}
        {impersonatingUser && (
          <div className="mb-8 p-4 bg-yellow-900 border-l-4 border-yellow-500 rounded flex justify-between items-center">
            <span className="text-yellow-100 font-semibold">
              Vous impersonnez: <strong>{impersonatingUser.full_name || impersonatingUser.name}</strong>
            </span>
            <button
              onClick={handleStopImpersonation}
              className="text-yellow-500 hover:text-yellow-300 font-bold"
            >
              ✕ Quitter l'impersonation
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--primary-color)' }}>
            Bienvenue {user?.full_name}, Modérateur
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-color)', opacity: 0.8 }}>
            Supervisez l'engagement, modérez les demandes et impersonnez les utilisateurs
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div
            className="rounded-lg p-6 border-l-4 shadow-sm"
            style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
          >
            <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Engagement Score
            </h3>
            <p className="text-4xl font-bold" style={{ color: 'var(--primary-color)' }}>{Math.min(10, Math.round(happinessScore / 10))}/10</p>
            <div className="mt-4 w-full rounded h-2" style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 20%, transparent)' }}>
              <div className="h-2 rounded" style={{ backgroundColor: 'var(--primary-color)', width: `${happinessScore}%` }}></div>
            </div>
          </div>
          <div
            className="rounded-lg p-6 border-l-4 shadow-sm"
            style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
          >
            <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Utilisateurs Heureux
            </h3>
            <p className="text-4xl font-bold" style={{ color: 'var(--primary-color)' }}>{happinessScore}%</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-color)', opacity: 0.6 }}>Synthèse expérience client</p>
          </div>
          <div
            className="rounded-lg p-6 border-l-4 shadow-sm"
            style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
          >
            <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Problèmes en Attente
            </h3>
            <p className="text-4xl font-bold" style={{ color: '#FF6B6B' }}>{issues.length}</p>
            <button className="mt-4 text-sm font-semibold" style={{ color: 'var(--primary-color)' }}>
              Gérer
            </button>
          </div>
          <div
            className="rounded-lg p-6 border-l-4 shadow-sm"
            style={{ backgroundColor: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}
          >
            <h3 className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-color)', opacity: 0.7 }}>
              Posts Forum
            </h3>
            <p className="text-4xl font-bold" style={{ color: 'var(--primary-color)' }}>{forumQuestions.length}</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-color)', opacity: 0.6 }}>À modérer</p>
          </div>
        </div>

        {/* Opportunities Tracking */}
        <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Opportunités Suivi</h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['all', 'premium', 'pro'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedTier(filter)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  selectedTier === filter
                    ? 'text-white'
                    : 'text-gray-400'
                }`}
                style={{
                  backgroundColor: selectedTier === filter ? 'var(--primary-color)' : 'transparent',
                  border: selectedTier === filter ? 'none' : '1px solid color-mix(in srgb, var(--text-color) 20%, transparent)'
                }}
              >
                {filter === 'all' ? 'Tous' : filter === 'premium' ? 'Premium' : 'Pro'}
              </button>
            ))}
            {['all', 'castings', 'workshops', 'courses'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedCategory(filter)}
                className={`px-4 py-2 rounded font-semibold transition ${
                  selectedCategory === filter
                    ? 'text-white'
                    : 'text-gray-400'
                }`}
                style={{
                  backgroundColor: selectedCategory === filter ? 'var(--primary-color)' : 'transparent',
                  border: selectedCategory === filter ? 'none' : '1px solid color-mix(in srgb, var(--text-color) 20%, transparent)'
                }}
              >
                {filter === 'all' ? 'Tout' : filter}
              </button>
            ))}
          </div>

          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-6 rounded-lg border transition hover:shadow-lg"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)'
                }}
              >
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-color)' }}>{opp.title}</h3>
                <div className="flex gap-2 mb-4">
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{ backgroundColor: 'var(--primary-color)', color: 'var(--text-color)' }}
                  >
                    {opp.tier}
                  </span>
                  <span
                    className="px-2 py-1 rounded text-xs font-semibold"
                    style={{ backgroundColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)', color: 'var(--text-color)', opacity: 0.8 }}
                  >
                    {opp.category}
                  </span>
                </div>
                <p style={{ color: 'var(--text-color)', opacity: 0.7 }} className="text-sm">
                  Statut: {opp.status}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Issues Tracking */}
        <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Problèmes Utilisateurs</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ borderBottomColor: 'color-mix(in srgb, var(--text-color) 20%, transparent)' }} className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Utilisateur</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Type</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Sujet</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Priorité</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold" style={{ color: 'var(--text-color)', opacity: 0.7 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue.id} style={{ borderBottomColor: 'color-mix(in srgb, var(--text-color) 10%, transparent)' }} className="border-b">
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)' }}>
                      {issue.user_id}
                    </td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{issue.category || issue.type}</td>
                    <td className="py-3 px-4 text-sm" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{issue.title || issue.subject}</td>
                    <td className="py-3 px-4 text-sm">
                      <span
                        className="px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor: issue.priority === 'high' ? '#FF6B6B' : '#FFA500',
                          color: '#FFFFFF'
                        }}
                      >
                        {issue.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <button
                        style={{ color: 'var(--primary-color)' }}
                        className="font-semibold hover:opacity-80"
                        onClick={() => handleIssueStatus(issue.id, 'resolved')}
                      >
                        Marquer résolu
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Forum Moderation */}
        <div className="rounded-lg shadow-sm p-8 mb-12" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Modération Forum</h2>
          <div className="space-y-4">
            {forumQuestions.map((post) => (
              <div
                key={post.id}
                className="p-4 rounded border transition hover:shadow-md"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)'
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--text-color)' }}>{post.title}</h3>
                    <p style={{ color: 'var(--text-color)', opacity: 0.7 }} className="text-sm">
                      {post.categoryLabel} • User {post.user_id}
                    </p>
                  </div>
                  <span
                    className="font-bold text-lg"
                    style={{ color: post.likes > post.dislikes ? '#4CAF50' : '#FF6B6B' }}
                  >
                    {post.likes - post.dislikes}
                  </span>
                </div>
                <button
                  style={{ color: 'var(--primary-color)' }}
                  className="text-sm font-semibold hover:opacity-80"
                >
                  Modérer
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* User Impersonation */}
        <div className="rounded-lg shadow-sm p-8" style={{ backgroundColor: 'var(--secondary-color)' }}>
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>Impersonation Utilisateurs</h2>
          <p style={{ color: 'var(--text-color)', opacity: 0.8 }} className="mb-6 text-sm">
            Impersonnez les utilisateurs pour voir leur expérience (admins système exclus)
          </p>
          <div className="space-y-3">
            {users.slice(0, 6).map((target) => (
              <div
                key={target.id}
                className="p-4 rounded border flex justify-between items-center"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--secondary-color) 85%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--text-color) 15%, transparent)'
                }}
              >
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--text-color)' }}>{target.full_name}</h3>
                  <p style={{ color: 'var(--text-color)', opacity: 0.7 }} className="text-sm">{target.email} • {target.role?.name}</p>
                </div>
                <button
                  onClick={() => handleImpersonate(target)}
                  className="px-4 py-2 rounded font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: 'var(--primary-color)' }}
                >
                  Impersonner
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
