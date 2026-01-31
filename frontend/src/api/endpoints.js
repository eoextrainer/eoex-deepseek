import api from './client';

export const authAPI = {
  register: (data) => api.post('/register', data),
  login: (data) => api.post('/login', data),
  getCurrentUser: () => api.get('/users/me'),
};

export const userAPI = {
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

export const subscriptionAPI = {
  getPlans: () => api.get('/subscriptions/plans'),
  getSubscriptions: () => api.get('/subscriptions'),
  getSubscription: (id) => api.get(`/subscriptions/${id}`),
  createSubscription: (data) => api.post('/subscriptions', data),
  updateSubscription: (id, data) => api.put(`/subscriptions/${id}`, data),
  deleteSubscription: (id) => api.delete(`/subscriptions/${id}`),
};

export const communityAPI = {
  getCommunities: () => api.get('/communities'),
  getCommunity: (id) => api.get(`/communities/${id}`),
  createCommunity: (data) => api.post('/communities', data),
  getQuestions: (communityId) => api.get(`/communities/${communityId}/questions`),
  createQuestion: (communityId, data) => api.post(`/communities/${communityId}/questions`, data),
  createAnswer: (communityId, questionId, data) => 
    api.post(`/communities/${communityId}/questions/${questionId}/answers`, data),
};
