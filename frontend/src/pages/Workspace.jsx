import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { Button, Card, Skeleton, Badge } from '../components/ui';
import { subscriptionAPI } from '../api/endpoints';

export const Workspace = () => {
  const { user } = useAuthStore();
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('highlights');

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const response = await subscriptionAPI.getSubscriptions();
      setSubscriptions(response.data || []);
    } catch (error) {
      console.error('Failed to load subscriptions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'highlights', label: 'Highlights', icon: '⭐' },
    { id: 'subscriptions', label: 'My Subscriptions', icon: '🎯' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
    { id: 'chat', label: 'Chat', icon: '💬' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-800 px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome back, {user?.email}
        </h1>
        <p className="text-gray-400">
          Continue your journey with EOEX
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-2 font-semibold text-sm transition-smooth border-b-2 ${
                activeTab === tab.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Highlights Tab */}
        {activeTab === 'highlights' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              Trending Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="card-hover">
                  <div className="w-full aspect-video bg-gradient-to-br from-red-600 to-red-900 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">Highlight {i}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">
                    Featured Module {i}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Discover new features and modules
                  </p>
                  <Button size="sm" className="w-full">
                    Explore
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Subscriptions Tab */}
        {activeTab === 'subscriptions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">My Subscriptions</h2>
              <Button variant="primary">Add Subscription</Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
              </div>
            ) : subscriptions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subscriptions.map((sub) => (
                  <Card key={sub.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-2">
                        {sub.plan_name || 'Standard Plan'}
                      </h3>
                      <p className="text-gray-400 text-sm mb-3">
                        Status: <Badge>{sub.status || 'active'}</Badge>
                      </p>
                      <p className="text-gray-400 text-sm">
                        Expires: {new Date(sub.end_date).toLocaleDateString() || 'N/A'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <p className="text-gray-400 mb-4">No active subscriptions</p>
                <Button>Browse Plans</Button>
              </Card>
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Top 5 Favorites</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Card key={i} className="card-hover text-center">
                  <div className="w-full aspect-square bg-gradient-to-br from-red-600 to-red-900 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <h3 className="text-white font-semibold mb-2">Favorite {i}</h3>
                  <Button variant="ghost" size="sm" className="w-full">
                    Open
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Community Chat</h2>
            <Card className="h-96 flex flex-col">
              <div className="flex-1 overflow-y-auto mb-4">
                <p className="text-gray-400 text-center py-8">
                  No messages yet. Start a conversation!
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <Button size="sm">Send</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspace;
