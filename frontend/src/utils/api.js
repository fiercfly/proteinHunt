import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 12000,
});

// Attach JWT from localStorage to every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('dp_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const dealsApi = {
  getAll:       (params) => api.get('/api/deals',             { params }).then(r => r.data),
  getOne:       (id)     => api.get(`/api/deals/${id}`).then(r => r.data),
  vote:         (id)     => api.post(`/api/deals/${id}/vote`).then(r => r.data),
  submit:       (data)   => api.post('/api/deals/submit', data).then(r => r.data),
  getBrands:    ()       => api.get('/api/deals/brands').then(r => r.data),
  getPostTypes: ()       => api.get('/api/deals/posttypes').then(r => r.data),
};

export const authApi = {
  register: (data) => api.post('/api/auth/register', data).then(r => r.data),
  login:    (data) => api.post('/api/auth/login',    data).then(r => r.data),
  me:       ()     => api.get('/api/auth/me').then(r => r.data),
};

export const userApi = {
  getSaved:   ()   => api.get('/api/users/saved').then(r => r.data),
  toggleSave: (id) => api.post(`/api/users/saved/${id}`).then(r => r.data),
};