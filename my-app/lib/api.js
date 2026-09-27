// src/lib/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Agar token hai toh header mein laga do
API.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('don_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 1. Signup API
export const signupUser = async (data) => {
  // Id 0 bhejna zaroori hai kyunke backend strict struct expect karta hai
  const payload = {
    id: 0,
    username: data.username,
    password: data.password,
    age: parseInt(data.age),
    city: data.city,
    role: data.role,
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

export default API;