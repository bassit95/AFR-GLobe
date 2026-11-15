// src/utils/image.js

// Origine backend :
//   priorité VITE_STORAGE_URL (ton .env existant)
//   sinon dérivée de VITE_API_URL (en retirant /api/v1)
const API_BASE = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1')
  .replace(/\/+$/, '');
const DERIVED_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, '');
const BACKEND_ORIGIN = (
  import.meta.env.VITE_STORAGE_URL || DERIVED_ORIGIN
).replace(/\/+$/, '');

export const IMAGE_PLACEHOLDER =
  'https://images.pexels.com/photos/18367026/pexels-photo-18367026.jpeg?auto=compress&cs=tinysrgb&h=900&w=700';

// Tous les préfixes d'assets statiques du frontend
const FRONTEND_PREFIXES = [
  '/images/',
  '/assets/',
  '/fonts/',
  '/videos/',
  '/icons/',
];

/**
 * Résout une URL d'image. Renvoie `null` si pas d'image.
 * Utilisé par imageUrl(), imageUrlOrNull() et ImageWithFallback.
 */
export function resolveImageUrl(path) {
  if (typeof path !== 'string' || path.length === 0) return null;

  // 🩹 FIX CRITIQUE : Storage::url() côté backend wrap même les URLs
  //    externes → "/storage/https://upload.wikimedia.org/..."
  //    On extrait l'URL d'origine.
  const wrappedExternal = path.match(/^\/(?:storage\/)?(https?:\/\/.+)$/);
  if (wrappedExternal) return wrappedExternal[1];

  // URL externe complète
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  // Asset public du frontend (Vite)
  if (FRONTEND_PREFIXES.some((prefix) => path.startsWith(prefix))) return path;

  // Chemin local (disque public Laravel)
  const clean = path.replace(/^\/+/, '');
  const storagePath = clean.startsWith('storage/') ? clean : `storage/${clean}`;
  return `${BACKEND_ORIGIN}/${storagePath}`;
}

/**
 * URL prête à afficher, avec placeholder Pexels si vide.
 * Pour les `background-image` CSS, `<meta property="og:image">`, etc.
 */
export function imageUrl(path) {
  return resolveImageUrl(path) ?? IMAGE_PLACEHOLDER;
}

/**
 * URL résolue ou `null`.
 * Utile quand le composant a son propre fallback (initiales, etc.).
 */
export function imageUrlOrNull(path) {
  return resolveImageUrl(path);
}