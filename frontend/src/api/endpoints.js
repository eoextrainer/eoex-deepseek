import api from './client';

export const authAPI = {
  register: (data) => api.post('/api/v1/auth/register', data),
  login: (data) => api.post('/api/v1/auth/login', data),
  getCurrentUser: () => api.get('/api/v1/users/me'),
};

export const userAPI = {
  getUsers: () => api.get('/api/v1/users'),
  getUser: (id) => api.get(`/api/v1/users/${id}`),
  updateUser: (id, data) => api.put(`/api/v1/users/${id}`, data),
  deleteUser: (id) => api.delete(`/api/v1/users/${id}`),
};

export const roleAPI = {
  getRoles: () => api.get('/api/v1/users/roles'),
};

export const subscriptionAPI = {
  getPlans: () => api.get('/api/v1/subscriptions/plans'),
  getSubscriptions: () => api.get('/api/v1/subscriptions'),
  getSubscription: (id) => api.get(`/api/v1/subscriptions/${id}`),
  getUserSubscriptions: (userId) => api.get(`/api/v1/subscriptions/user/${userId}`),
  createSubscription: (data) => api.post('/api/v1/subscriptions', data),
  updateSubscription: (id, data) => api.put(`/api/v1/subscriptions/${id}`, data),
  deleteSubscription: (id) => api.delete(`/api/v1/subscriptions/${id}`),
};

export const featureRequestAPI = {
  create: (data) => api.post('/api/v1/feature-requests', data),
  getAll: (status) => api.get('/api/v1/feature-requests/all', { params: status ? { status_filter: status } : {} }),
  getMine: () => api.get('/api/v1/feature-requests/my-requests'),
  update: (id, data) => api.patch(`/api/v1/feature-requests/${id}`, data),
  createAIPrompt: (id, data) => api.post(`/api/v1/feature-requests/${id}/ai-prompts`, data),
};

export const campaignAPI = {
  getCampaigns: (status) => api.get('/api/v1/campaigns', { params: status ? { status } : {} }),
  createCampaign: (data) => api.post('/api/v1/campaigns', data),
  updateCampaign: (id, data) => api.patch(`/api/v1/campaigns/${id}`, data),
};

export const opportunityAPI = {
  getOpportunities: (tier, category) => api.get('/api/v1/platform/opportunities', { params: { tier, category } }),
  createOpportunity: (data) => api.post('/api/v1/platform/opportunities', data),
};

export const issueAPI = {
  getAll: (status) => api.get('/api/v1/platform/issues/all', { params: status ? { status_filter: status } : {} }),
  getMine: () => api.get('/api/v1/platform/issues/my-issues'),
  update: (id, data) => api.patch(`/api/v1/platform/issues/${id}`, data),
  create: (data) => api.post('/api/v1/platform/issues', data),
};

export const serviceAPI = {
  getServices: () => api.get('/api/v1/services'),
  createService: (data) => api.post('/api/v1/services', data),
  updateService: (id, data) => api.patch(`/api/v1/services/${id}`, data),
};

export const integrationAPI = {
  getIntegrations: () => api.get('/api/v1/integrations'),
  createIntegration: (data) => api.post('/api/v1/integrations', data),
  updateIntegration: (id, data) => api.patch(`/api/v1/integrations/${id}`, data),
  logExchange: (id, data) => api.post(`/api/v1/integrations/${id}/exchanges`, data),
};

export const impersonationAPI = {
  getAll: (activeOnly = false) => api.get('/api/v1/impersonations', { params: { active_only: activeOnly } }),
  start: (data) => api.post('/api/v1/impersonations/start', data),
  end: (id) => api.post(`/api/v1/impersonations/${id}/end`),
};

export const communityAPI = {
  getCommunities: () => api.get('/api/v1/communities'),
  getCommunity: (id) => api.get(`/api/v1/communities/${id}`),
  createCommunity: (data) => api.post('/api/v1/communities', data),
  getQuestions: (communityId, category) => api.get(`/api/v1/communities/${communityId}/questions`, { params: category ? { category } : {} }),
  getQuestion: (communityId, questionId) => api.get(`/api/v1/communities/${communityId}/questions/${questionId}`),
  createQuestion: (communityId, data) => api.post(`/api/v1/communities/${communityId}/questions`, data),
  createAnswer: (communityId, questionId, data) => 
    api.post(`/api/v1/communities/${communityId}/questions/${questionId}/answers`, data),
  listAnswers: (communityId, questionId) => api.get(`/api/v1/communities/${communityId}/questions/${questionId}/answers`),
};
