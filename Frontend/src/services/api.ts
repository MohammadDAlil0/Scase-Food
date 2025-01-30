import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:3001', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptors for request/response handling (e.g., adding auth tokens)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;