import api from './api';

export async function getBoutiques(params, signal) {
  // Mappé vers IndexBoutiqueRequest
  const response = await api.get('/boutiques', {
    params: {
      search: params.search,
      country_id: params.countryId,
      city_id: params.cityId,
      type: params.type,
      brand_id: params.brandId,
      page: params.page || 1,
      per_page: params.perPage || 12,
    },
    signal,
  });
  return response.data; // { success, data, meta }
}

export async function getCountries(signal) {
  const response = await api.get('/countries', { params: { per_page: 100 }, signal });
  return response.data;
}

export async function getCities(countryId, signal) {
  if (!countryId || countryId === 'all') return { data: [] };
  const response = await api.get('/cities', { params: { country_id: countryId, per_page: 100 }, signal });
  return response.data;
}