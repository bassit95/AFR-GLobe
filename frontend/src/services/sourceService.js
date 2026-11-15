// src/services/sourceService.js
import api from './api';

export async function fetchSources(params = {}, signal) {
  const { data } = await api.get('/sources', {
    params: {
      search: params.search,
      source_type: params.sourceType,
      publisher: params.publisher,
      page: params.page || 1,
      per_page: params.perPage || 20,
    },
    signal,
  });
  return data;
}

export async function fetchSource(id, signal) {
  const { data } = await api.get(`/sources/${id}`, { signal });
  return data;
}

export async function createSource(payload) {
  const { data } = await api.post('/sources', payload);
  return data;
}
export async function updateSource(id, payload) {
  const { data } = await api.put(`/sources/${id}`, payload);
  return data;
}
export async function deleteSource(id) {
  const { data } = await api.delete(`/sources/${id}`);
  return data;
}