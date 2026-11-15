// src/services/catalogService.js
import api from './api';

// ─────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────

export async function fetchCategories({ search, perPage = 100 } = {}, signal) {
  const { data } = await api.get('/categories', {
    params: { search, per_page: perPage },
    signal,
  });
  return data;
}

export async function fetchCategory(id, signal) {
  const { data } = await api.get(`/categories/${id}`, { signal });
  return data;
}
// locationService.js — idem
export async function fetchCountries({ search, continent, perPage = 100 } = {}, signal) {
  const { data } = await api.get('/countries', {
    params: { search, continent, per_page: perPage },
    signal,   // ✅
  });
  return data;
}
export async function createCategory(payload) {
  const { data } = await api.post('/categories', payload);
  return data;
}

export async function updateCategory(id, payload) {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data;
}

export async function deleteCategory(id) {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
}

// ─────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────

export async function fetchStyles({ parentId, search, perPage = 100 } = {}, signal) {
  const { data } = await api.get('/styles', {
    params: { parent_id: parentId, search, per_page: perPage },
    signal,
  });
  return data;
}

export async function fetchStyle(id, signal) {
  const { data } = await api.get(`/styles/${id}`, { signal });
  return data;
}

export async function createStyle(payload) {
  const { data } = await api.post('/styles', payload);
  return data;
}

export async function updateStyle(id, payload) {
  const { data } = await api.put(`/styles/${id}`, payload);
  return data;
}

export async function deleteStyle(id) {
  const { data } = await api.delete(`/styles/${id}`);
  return data;
}