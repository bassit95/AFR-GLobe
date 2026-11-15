// src/services/resourceService.js
import api from './api';

export async function fetchResources(params = {}, signal) {
  const { data } = await api.get('/resources', {
    params: {
      search: params.search,
      resource_type: params.resourceType,
      page: params.page || 1,
      per_page: params.perPage || 20,
    },
    signal,
  });
  return data;
}

export async function fetchResourceBySlug(slug, signal) {
  const { data } = await api.get(`/resources/${slug}`, { signal });
  return data;
}

export async function createResource(payload) {
  const { data } = await api.post('/resources', payload);
  return data;
}
export async function updateResource(slug, payload) {
  const { data } = await api.put(`/resources/${slug}`, payload);
  return data;
}
export async function deleteResource(slug) {
  const { data } = await api.delete(`/resources/${slug}`);
  return data;
}