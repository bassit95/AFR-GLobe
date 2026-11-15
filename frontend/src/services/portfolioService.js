// src/services/portfolioService.js
import api from './api';

export async function fetchPortfolioItems(params = {}, signal) {
  const { data } = await api.get('/portfolio-items', {
    params: {
      search: params.search,
      creator_id: params.creatorId,
      collection_id: params.collectionId,
      year: params.year,
      page: params.page || 1,
      per_page: params.perPage || 12,
    },
    signal,
  });
  return data;
}

export async function fetchPortfolioItem(id, signal) {
  const { data } = await api.get(`/portfolio-items/${id}`, { signal });
  return data;
}

export async function createPortfolioItem(payload) {
  const { data } = await api.post('/portfolio-items', payload);
  return data;
}
export async function updatePortfolioItem(id, payload) {
  const { data } = await api.put(`/portfolio-items/${id}`, payload);
  return data;
}
export async function deletePortfolioItem(id) {
  const { data } = await api.delete(`/portfolio-items/${id}`);
  return data;
}