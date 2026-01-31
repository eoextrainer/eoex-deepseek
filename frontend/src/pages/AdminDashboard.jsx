import React from 'react';
import { Card, Button } from '../components/ui';
import { useAuthStore } from '../store';

export const AdminDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { label: 'Total Users', value: '2,543', change: '+12%' },
    { label: 'Active Subscriptions', value: '1,892', change: '+8%' },
    { label: 'Revenue', value: '$48,290', change: '+23%' },
    { label: 'Engagement', value: '78%', change: '+5%' },
  ];

  const recentActivity = [
    { id: 1, user: 'John Doe', action: 'Upgraded Plan', time: '2 hours ago' },
    { id: 2, user: 'Jane Smith', action: 'Submitted Feature Request', time: '3 hours ago' },
    { id: 3, user: 'Mike Johnson', action: 'Joined Community', time: '5 hours ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Salesforce-style Admin Header */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-6">
        <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Platform Management & Analytics</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm font-semibold mb-1">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold text-white">
                    {stat.value}
                  </h3>
                </div>
                <span className="text-green-600 text-sm font-semibold">
                  {stat.change}
                </span>
              </div>
              <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-600" style={{ width: '75%' }} />
              </div>
            </Card>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <h3 className="text-white font-semibold mb-4">User Management</h3>
            <Button className="w-full mb-2" size="sm">
              View All Users
            </Button>
            <Button variant="secondary" className="w-full" size="sm">
              Add Guest Account
            </Button>
          </Card>

          <Card>
            <h3 className="text-white font-semibold mb-4">Configuration</h3>
            <Button className="w-full mb-2" size="sm">
              Theme Settings
            </Button>
            <Button variant="secondary" className="w-full" size="sm">
              Language Settings
            </Button>
          </Card>

          <Card>
            <h3 className="text-white font-semibold mb-4">Subscriptions</h3>
            <Button className="w-full mb-2" size="sm">
              Manage Plans
            </Button>
            <Button variant="secondary" className="w-full" size="sm">
              View Revenue
            </Button>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-white font-semibold text-lg mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between pb-4 border-b border-gray-700 last:border-0"
              >
                <div>
                  <p className="text-white font-semibold">{activity.user}</p>
                  <p className="text-gray-400 text-sm">{activity.action}</p>
                </div>
                <span className="text-gray-500 text-sm">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
