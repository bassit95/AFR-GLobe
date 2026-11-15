// src/services/brandService.js
import api from './api';

export async function fetchBrands(params = {}, signal) {
  const { data } = await api.get('/brands', {
    params: {
      search: params.search,
      country_id: params.countryId,
      city_id: params.cityId,
      creator_id: params.creatorId,
      page: params.page || 1,
      per_page: params.perPage || 12,
    },
    signal,
  });
  return data;
}

export async function fetchBrandBySlug(slug, signal) {
  const { data } = await api.get(`/brands/${slug}`, { signal });
  return data;
}

export async function fetchBrandCollections(slug, { page = 1, perPage = 12 } = {}, signal) {
  const { data } = await api.get(`/brands/${slug}/collections`, {
    params: { page, per_page: perPage },
    signal,
  });
  return data;
}

export async function fetchBrandBoutiques(slug, { page = 1, perPage = 20 } = {}, signal) {
  const { data } = await api.get(`/brands/${slug}/boutiques`, {
    params: { page, per_page: perPage },
    signal,
  });
  return data;
}

// ADMIN — ⚠️ update/delete par ID, pas par slug
// payload: {
//   name, slug, logo, cover_image, description, founded_year,
//   country_id, city_id, website_url, status,
//   creators: [{ id: number, role: string }],
//   source_ids: number[]
// }
export async function createBrand(payload) {
  const { data } = await api.post('/brands', payload);
  return data;
}
// ✅ APRÈS — update/delete par SLUG (cohérent avec Brand::getRouteKeyName())
export async function updateBrand(slug, payload) {
  const { data } = await api.put(`/brands/${slug}`, payload);
  return data;
}
export async function deleteBrand(slug) {
  const { data } = await api.delete(`/brands/${slug}`);
  return data;
}