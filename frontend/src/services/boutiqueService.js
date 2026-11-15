// src/services/boutiqueService.js
import api from './api';

export async function fetchBoutiques(params = {}, signal) {
  const { data } = await api.get('/boutiques', {
    params: {
      search: params.search,
      brand_id: params.brandId,
      country_id: params.countryId,
      city_id: params.cityId,
      type: params.type,
      page: params.page || 1,
      per_page: params.perPage || 20,
    },
    signal,
  });
  return data;
}

export async function fetchBoutique(id, signal) {
  const { data } = await api.get(`/boutiques/${id}`, { signal });
  return data;
}

// payload: {
//   brand_id, name, address, country_id, city_id,
//   latitude, longitude, phone, email, type, website_url,
//   opening_hours: {...}, status, source_ids: number[]
// }
// ⚠️ Backend ne gère pas encore `image` (à activer côté Laravel)
export async function createBoutique(payload) {
  const { data } = await api.post('/boutiques', payload);
  return data;
}
export async function updateBoutique(id, payload) {
  const { data } = await api.put(`/boutiques/${id}`, payload);
  return data;
}
export async function deleteBoutique(id) {
  const { data } = await api.delete(`/boutiques/${id}`);
  return data;
}