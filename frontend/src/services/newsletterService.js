// src/services/newsletterService.js
import api from './api';

export async function subscribeToNewsletter(payload) {
  const { data } = await api.post('/newsletter', payload);
  return data;
}