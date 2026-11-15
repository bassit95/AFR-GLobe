// src/services/searchService.js
import api from './api';

/**
 * Recherche globale : creators + brands + articles + collections + products.
 * Retourne { data: { creators, brands, ... } }
 */
export async function fetchSearch(query, signal) {
  const trimmed = String(query ?? '').trim();
  if (trimmed.length < 2) return null;

  const { data } = await api.get('/search', {
    params: { q: trimmed },
    signal,
  });
  
  return data;
}