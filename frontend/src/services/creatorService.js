// src/services/creatorService.js
import api from './api';

/**
 * Liste des créateurs publiés.
 * Mapping strict vers IndexCreatorRequest (filters validés côté Laravel).
 */
export async function fetchCreators(params = {}, signal) {
  const { data } = await api.get('/creators', {
    params: {
      search: params.search,
      country_origin: params.countryOrigin,
      country_residence: params.countryResidence,
      city: params.city,
      gender: params.gender,
      category: params.category,
      style: params.style,
      letter: params.letter,
      page: params.page || 1,
      per_page: params.perPage || params.per_page || 12,
    },
    signal,
  });
  return data;
}

/**
 * Détail d'un créateur par slug.
 * Backend bind sur {creator:slug} via getRouteKeyName().
 */
export async function fetchCreatorBySlug(slug, signal) {
  const { data } = await api.get(`/creators/${slug}`, { signal });
  return data;
}

/**
 * Portfolio paginé d'un créateur.
 */
export async function fetchCreatorPortfolio(slug, { page = 1, perPage = 12 } = {}, signal) {
  const { data } = await api.get(`/creators/${slug}/portfolio`, {
    params: { page, per_page: perPage },
    signal,
  });
  return data;
}

// ─────────────────────────────────────────────────────────────
// ADMIN — toutes les mutations retournent { success, message, data }
// ─────────────────────────────────────────────────────────────

/**
 * Créer un créateur.
 * payload: {
 *   name, slug, profile_image, cover_image,
 *   country_of_origin_id, country_of_residence_id, city_of_residence_id,
 *   gender, short_bio, biography, social_links, website_url,
 *   status, verification_status,
 *   category_ids: number[], style_ids: number[],
 *   brand_ids: number[], source_ids: number[]
 * }
 */
export async function createCreator(payload) {
  const { data } = await api.post('/creators', payload);
  return data;
}

/**
 * Modifier un créateur par SLUG (bind sur getRouteKeyName()).
 */
export async function updateCreator(slug, payload) {
  const { data } = await api.put(`/creators/${slug}`, payload);
  return data;
}

/**
 * Supprimer un créateur par SLUG.
 */
export async function deleteCreator(slug) {
  const { data } = await api.delete(`/creators/${slug}`);
  return data;
}