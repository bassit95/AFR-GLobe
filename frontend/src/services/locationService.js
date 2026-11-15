// src/services/locationService.js
import api from './api';

// COUNTRIES
export async function fetchCountries({ search, continent, perPage = 100 } = {}, signal) {
  const { data } = await api.get('/countries', {
    params: { search, continent, per_page: perPage },
    signal,
  });
  return data;
}
export async function fetchCountry(code, signal) {
  const { data } = await api.get(`/countries/${code}`, { signal });
  return data;
}
export async function createCountry(payload) {
  const { data } = await api.post('/countries', payload);
  return data;
}
export async function updateCountry(id, payload) {
  const { data } = await api.put(`/countries/${id}`, payload);
  return data;
}
export async function deleteCountry(id) {
  const { data } = await api.delete(`/countries/${id}`);
  return data;
}

// CITIES
export async function fetchCities({ countryId, search, perPage = 100 } = {}, signal) {
  const { data } = await api.get('/cities', {
    params: { country_id: countryId, search, per_page: perPage },
    signal,
  });
  return data;
}
export async function fetchCity(id, signal) {
  const { data } = await api.get(`/cities/${id}`, { signal });
  return data;
}
export async function createCity(payload) {
  const { data } = await api.post('/cities', payload);
  return data;
}
export async function updateCity(id, payload) {
  const { data } = await api.put(`/cities/${id}`, payload);
  return data;
}
export async function deleteCity(id) {
  const { data } = await api.delete(`/cities/${id}`);
  return data;
}