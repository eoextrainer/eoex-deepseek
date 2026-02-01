import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function ModeratorDashboard() {
  const [highlights, setHighlights] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userEngagement, setUserEngagement] = useState(0);
  const [canImpersonate, setCanImpersonate] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [oppRes, issuesRes] = await Promise.all([
        api.get('/api/v1/platform/opportunities'),
        api.get('/api/v1/platform/issues')
      ]);
      
      setOpportunities(oppRes.data);
      setIssues(issuesRes.data);
      setHighlights(oppRes.data.slice(0, 5));
      setUserEngagement(87);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Community Moderator Dashboard</h1>
      
      {/* Engagement Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg p-6 border border-purple-600">
          <h3 className="text-gray-400 text-sm mb-2">User Engagement</h3>
          <p className="text-3xl font-bold">{userEngagement}%</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-purple-600">
          <h3 className="text-gray-400 text-sm mb-2">Active Highlights</h3>
          <p className="text-3xl font-bold">{highlights.length}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-purple-600">
          <h3 className="text-gray-400 text-sm mb-2">Open Opportunities</h3>
          <p className="text-3xl font-bold">{opportunities.length}</p>
        </div>
        <div className="bg-gray-900 rounded-lg p-6 border border-purple-600">
          <h3 className="text-gray-400 text-sm mb-2">Reported Issues</h3>
          <p className="text-3xl font-bold">{issues.length}</p>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Community Highlights</h2>
        <div className="grid grid-cols-3 gap-6">
          {highlights.map(highlight => (
            <div key={highlight.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
              <div className="h-40 bg-gradient-to-br from-purple-900 to-gray-900"></div>
              <div className="p-4">
                <h3 className="font-bold mb-2">{highlight.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{highlight.description}</p>
                <button className="text-purple-400 hover:text-purple-300 text-sm">Learn More →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Opportunities Tracking */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Service Opportunities</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Tier</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.slice(0, 5).map(opp => (
                <tr key={opp.id} className="border-t border-gray-800">
                  <td className="px-6 py-3">{opp.title}</td>
                  <td className="px-6 py-3">{opp.category}</td>
                  <td className="px-6 py-3">{opp.tier}</td>
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

      {/* Issues Management */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Pending Issues</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Priority</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {issues.slice(0, 5).map(issue => (
                <tr key={issue.id} className="border-t border-gray-800">
                  <td className="px-6 py-3">{issue.title}</td>
                  <td className="px-6 py-3">
                    <span className={`text-sm font-semibold ${issue.priority === 'high' ? 'text-red-400' : issue.priority === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-6 py-3">{issue.status}</td>
                  <td className="px-6 py-3">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">Assign</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Impersonation Tool */}
      <div className="bg-gray-900 rounded-lg p-6 border border-yellow-600">
        <h2 className="text-2xl font-bold mb-4">User Experience Review</h2>
        <p className="text-gray-400 mb-4">Impersonate any user (excluding System Admins) to review their experience and identify issues.</p>
        <div className="flex gap-4">
          <input 
            type="email" 
            placeholder="Enter user email" 
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
          />
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded">
            Impersonate User
          </button>
        </div>
      </div>
    </div>
  );
}
