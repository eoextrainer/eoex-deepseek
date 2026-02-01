import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function CommunityAdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    campaigns: 0,
    featureRequests: 0
  });
  const [subscriptions, setSubscriptions] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [subsRes, campaignsRes] = await Promise.all([
        api.get('/api/v1/subscriptions'),
        api.get('/api/v1/campaigns')
      ]);
      
      setSubscriptions(subsRes.data);
      setCampaigns(campaignsRes.data);
      setStats({
        totalUsers: 450,
        activeSubscriptions: subsRes.data.filter(s => s.status === 'active').length,
        campaigns: campaignsRes.data.length,
        featureRequests: 23
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Community Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-blue-600">
          <h3 className="text-gray-400 text-sm mb-2">Total Community Users</h3>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-blue-600">
          <h3 className="text-gray-400 text-sm mb-2">Active Subscriptions</h3>
          <p className="text-3xl font-bold">{stats.activeSubscriptions}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-blue-600">
          <h3 className="text-gray-400 text-sm mb-2">Active Campaigns</h3>
          <p className="text-3xl font-bold">{stats.campaigns}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-blue-600">
          <h3 className="text-gray-400 text-sm mb-2">Feature Requests</h3>
          <p className="text-3xl font-bold">{stats.featureRequests}</p>
        </div>
      </div>

      {/* Subscriptions Management */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Subscription Management</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left">Plan</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Active Users</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.slice(0, 5).map(sub => (
                <tr key={sub.id} className="border-t border-gray-800">
                  <td className="px-6 py-3">{sub.name}</td>
                  <td className="px-6 py-3">${sub.price}</td>
                  <td className="px-6 py-3">{sub.active_users || 0}</td>
                  <td className="px-6 py-3">
                    <span className="px-3 py-1 rounded text-sm bg-green-900 text-green-200">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaigns */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Marketing Campaigns</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mb-4">
          Create Campaign
        </button>
        <div className="grid grid-cols-3 gap-6">
          {campaigns.slice(0, 6).map(campaign => (
            <div key={campaign.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-bold mb-2">{campaign.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{campaign.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Progress: {campaign.progress}%</span>
                <button className="text-blue-400 hover:text-blue-300">Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Requests Vetting */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Feature Requests to Vet</h2>
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <p className="text-gray-400">You have {stats.featureRequests} pending feature requests to review.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded mt-4">
            Review Requests
          </button>
        </div>
      </div>
    </div>
  );
}
