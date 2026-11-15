// src/services/collectionService.js
import api from './api';

export async function fetchCollections(params = {}, signal) {
  const { data } = await api.get('/collections', {
    params: {
      search: params.search,
      brand_id: params.brandId,
      year: params.year,
      season: params.season,
      page: params.page || 1,
      per_page: params.perPage || 12,
    },
    signal,
  });
  return data;
}

export async function fetchCollectionBySlug(slug, signal) {
  const { data } = await api.get(`/collections/${slug}`, { signal });
  return data;
}

export async function fetchCollectionProducts(slug, { page = 1, perPage = 12 } = {}, signal) {
  const { data } = await api.get(`/collections/${slug}/products`, {
    params: { page, per_page: perPage },
    signal,
  });
  return data;
}

export async function createCollection(payload) {
  const { data } = await api.post('/collections', payload);
  return data;
}
export async function updateCollection(slug, payload) {
  const { data } = await api.put(`/collections/${slug}`, payload);
  return data;
}
export async function deleteCollection(slug) {
  const { data } = await api.delete(`/collections/${slug}`);
  return data;
}