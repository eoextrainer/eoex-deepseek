import React, { useState, useEffect } from 'react';
import api from '../../api/client';

export default function UserWorkspace() {
  const [highlights, setHighlights] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [topSubscriptions, setTopSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeatureRequest, setShowFeatureRequest] = useState(false);
  const [featureForm, setFeatureForm] = useState({ title: '', description: '', priority: 'medium' });

  useEffect(() => {
    fetchWorkspaceData();
  }, []);

  const fetchWorkspaceData = async () => {
    try {
      const [highRes, subRes] = await Promise.all([
        api.get('/api/v1/platform/opportunities'),
        api.get('/api/v1/subscriptions')
      ]);
      
      setHighlights(highRes.data.slice(0, 5));
      setSubscriptions(subRes.data);
      setTopSubscriptions(subRes.data.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch workspace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeatureRequest = async () => {
    try {
      await api.post('/api/v1/feature-requests/', featureForm);
      setFeatureForm({ title: '', description: '', priority: 'medium' });
      setShowFeatureRequest(false);
      alert('Feature request submitted successfully!');
    } catch (error) {
      console.error('Failed to submit feature request:', error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Video Section */}
      <div className="relative w-full h-96 bg-black overflow-hidden">
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/J1GCDcbYIRI?autoplay=1&mute=1&loop=1&playlist=J1GCDcbYIRI"
          title="Paris Fashion Week Runway"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Welcome to Your Workspace</h1>

        {/* Menu Navigation */}
        <div className="flex gap-6 mb-8 text-lg">
          <button className="text-white hover:text-gray-300">🎯 Abonnement</button>
          <button className="text-white hover:text-gray-300">❤️ Portfolio</button>
          <button className="text-white hover:text-gray-300">💬 Messagerie</button>
        </div>

        {/* Latest Highlights */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Latest Highlights</h2>
          <div className="grid grid-cols-5 gap-4">
            {highlights.map(highlight => (
              <div key={highlight.id} className="bg-gray-900 rounded-lg overflow-hidden hover:scale-105 transition cursor-pointer border border-gray-800">
                <div className="h-48 bg-gradient-to-br from-red-900 to-gray-900"></div>
                <div className="p-4">
                  <h3 className="font-bold text-sm line-clamp-2">{highlight.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top Subscriptions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Top 5 Favorite Subscriptions</h2>
          <div className="grid grid-cols-5 gap-6">
            {topSubscriptions.map(sub => (
              <div key={sub.id} className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-red-600 transition">
                <h3 className="font-bold text-lg mb-2">{sub.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{sub.description}</p>
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm w-full">
                  Upgrade
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Subscription Management */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Manage Your Subscriptions</h2>
          <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left">Plan</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Renewal Date</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.slice(0, 5).map(sub => (
                  <tr key={sub.id} className="border-t border-gray-800">
                    <td className="px-6 py-3">{sub.name}</td>
                    <td className="px-6 py-3">
                      <span className="px-3 py-1 rounded text-sm bg-green-900 text-green-200">Active</span>
                    </td>
                    <td className="px-6 py-3">2025-02-15</td>
                    <td className="px-6 py-3">
                      <button className="text-blue-400 hover:text-blue-300 text-sm">Manage</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Feature Request Section */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Request New Features</h2>
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
            <p className="text-gray-400 mb-4">
              Have an idea for a new feature or improvement? Submit your request here and our team will review it.
            </p>
            {!showFeatureRequest ? (
              <button
                onClick={() => setShowFeatureRequest(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Submit Feature Request
              </button>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Feature Title"
                  value={featureForm.title}
                  onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                />
                <textarea
                  placeholder="Feature Description"
                  value={featureForm.description}
                  onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white h-32"
                />
                <select
                  value={featureForm.priority}
                  onChange={(e) => setFeatureForm({ ...featureForm, priority: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <div className="flex gap-4">
                  <button
                    onClick={handleSubmitFeatureRequest}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                  >
                    Submit
                  </button>
                  <button
                    onClick={() => setShowFeatureRequest(false)}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
