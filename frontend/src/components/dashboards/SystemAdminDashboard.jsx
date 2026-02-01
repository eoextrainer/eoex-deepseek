import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SystemAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    platformHealth: 'Healthy',
  });
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Placeholder for platform metrics
      setStats({
        totalUsers: 450,
        activeSubscriptions: 320,
        platformHealth: 'Healthy',
        uptime: '99.9%',
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8100/api/v1/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>System Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <h3>Active Subscriptions</h3>
          <p className="stat-value">{stats.activeSubscriptions}</p>
        </div>
        <div className="stat-card">
          <h3>Platform Health</h3>
          <p className="stat-value">{stats.platformHealth}</p>
        </div>
        <div className="stat-card">
          <h3>Uptime</h3>
          <p className="stat-value">{stats.uptime}</p>
        </div>
      </div>

      <div className="section">
        <h2>User Management</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.full_name}</td>
                <td>{user.role.name}</td>
                <td>{user.is_active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button className="btn-small">Edit</button>
                  <button className="btn-small">Grant Privilege</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="section">
        <h2>Microservices Management</h2>
        <div className="services-grid">
          <div className="service-card">
            <h4>User Authentication</h4>
            <p>Status: <span className="status-active">Active</span></p>
          </div>
          <div className="service-card">
            <h4>Subscription Service</h4>
            <p>Status: <span className="status-active">Active</span></p>
          </div>
          <div className="service-card">
            <h4>Community Forums</h4>
            <p>Status: <span className="status-active">Active</span></p>
          </div>
          <div className="service-card">
            <h4>AI Prompt Engine</h4>
            <p>Status: <span className="status-active">Active</span></p>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Feature Request Analysis</h2>
        <p>Capturing and analyzing AI-ready prompts from community feature requests...</p>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;
