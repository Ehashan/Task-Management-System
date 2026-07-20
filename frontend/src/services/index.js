import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const taskService = {
  getTasks: (params) => api.get('/tasks', { params }),
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
};

export const adminService = {
  getStats: () => api.get('/admin/stats'),
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/status`),
  getAllTasks: (params) => api.get('/admin/tasks', { params }),
  updateTask: (id, data) => api.put(`/admin/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/admin/tasks/${id}`),
};
