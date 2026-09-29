// src/lib/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Token ko har request ke sath attach karo
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('don_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 1. Signup API (THE FIX: is_suspended add kar diya!)
export const signupUser = async (data) => {
  const payload = {
    id: 0,
    username: data.username,
    password: data.password,
    role: data.role || 'user',
    is_suspended: false, // <-- YEH MISSING THA! Naya user hamesha active hoga
  };
  const response = await API.post('/auth/signup', payload);
  return response.data;
};

// 2. Login API
export const loginUserApi = async (data) => {
  const payload = {
    username: data.username,
    password: data.password,
  };
  const response = await API.post('/auth/login', payload);
  return response.data;
};

// 3. Admin: Get All Users
export const getAdminUsers = async () => {
  const response = await API.get('/admin/users');
  return response.data;
};

// 4. Admin: Suspend User by ID
export const suspendUserApi = async (id) => {
  const response = await API.put(`/admin/suspend/${id}`);
  return response.data;
};

export default API;