// src/utils/immersionHelpers.js
import { resolveImageUrl } from '@/utils/image';

export const FALLBACK_IMAGES = [
  '/images/banner/banner-02.jpeg',
  '/images/banner/banner-03.jpeg',
  '/images/banner/banner-05.jpeg',
];

export function getRelationName(value) {
  if (!value) return '';
  return typeof value === 'string' ? value : value.name || '';
}

export function normalizeBoutique(boutique, index = 0) {
  const countryName = getRelationName(boutique.country) || boutique.country_name || '';
  const cityName = getRelationName(boutique.city) || boutique.city_name || '';
  const brandName = getRelationName(boutique.brand) || boutique.brand_name || '';
  // Backend BoutiqueResource n'expose pas d'image → null → fallback icon dans BoutiqueCard
  const sourceImage =
    boutique.image_url ||
    boutique.image ||
    boutique.photo ||
    boutique.cover_image ||
    boutique.brand?.logo_url ||
    null;

  return {
    ...boutique,
    cityName,
    countryName,
    brandName,
    resolvedImage: resolveImageUrl(sourceImage) || null,
    fallbackImage: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
  };
}

export function typeLabel(type) {
  if (type === 'physical') return 'Boutique physique';
  if (type === 'online') return 'Boutique en ligne';
  if (type === 'both') return 'Physique & en ligne';
  return 'Point de vente';
}

export function safeExternalUrl(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    const url = new URL(value.startsWith('http') ? value : `https://${value}`);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

export function mapsUrl(boutique) {
  const query = [boutique.address, boutique.cityName, boutique.countryName]
    .filter(Boolean)
    .join(', ');
  return query
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
    : null;
}

export function getOpeningHours(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.filter(Boolean).join(' · ');
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, hours]) => Boolean(hours))
      .slice(0, 2)
      .map(([day, hours]) => `${day}: ${hours}`)
      .join(' · ');
  }
  return '';
}