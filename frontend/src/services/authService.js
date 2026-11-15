// src/services/authService.js
import api from './api';
import axios from 'axios';

// 🎯 On force "localhost" pour correspondre au backend
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export async function login({ email, password }) {
  // 🎯 L'appel CSRF doit utiliser localhost
  await axios.get(`${BACKEND_URL}/sanctum/csrf-cookie`, { withCredentials: true });

  const response = await api.post('/login', { email, password });
  return response.data.user;
}

export async function me() {
  const response = await api.get('/me');
  return response.data.user;
}

export async function logout() {
  await api.post('/logout');
}

// Cette fonction n'est plus utile, car l'état est géré par le cookie
export function isAuthenticated() {
  return false; // L'état sera géré par le contexte
}