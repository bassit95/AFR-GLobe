// src/utils/errorHelpers.js
//
// ⚠️ FICHIER CRITIQUE — 2 exports attendus :
//   - getErrorType(error)   → string
//   - getErrorMessage(error) → string
//
// Utilisé par : useCreatorDirectory, useCreatorProfile, et autres hooks.

/**
 * Détermine le type d'erreur pour choisir l'icône/titre dans <ErrorMessage>.
 *
 * Compatible avec :
 *   - ApiError (déjà typée par l'intercepteur api.js) → retourne error.type tel quel
 *   - Erreur Axios brute (si un jour l'intercepteur est contourné) → déduit depuis error.response.status
 *   - Erreur JS standard → 'generic'
 *
 * @returns {'network'|'server'|'notFound'|'forbidden'|'unauthorized'|'validation'|'generic'}
 */
export function getErrorType(error) {
  if (!error) return 'generic';

  // 1. ApiError de notre intercepteur → déjà typée
  if (typeof error.type === 'string' && error.type) {
    return error.type;
  }

  // 2. Erreur Axios brute (fallback de sécurité)
  if (error.response) {
    const status = error.response.status;
    if (status === 401) return 'unauthorized';
    if (status === 403) return 'forbidden';
    if (status === 404) return 'notFound';
    if (status === 422) return 'validation';
    if (status >= 500) return 'server';
    return 'generic';
  }

  // 3. Erreur réseau (pas de response)
  if (error.request || error.code === 'ERR_NETWORK' || error.name === 'NetworkError') {
    return 'network';
  }

  // 4. Erreur d'abandon (ne devrait jamais arriver ici car filtrée avant)
  if (error.name === 'AbortError' || error.name === 'CanceledError') {
    return 'network';
  }

  return 'generic';
}

/**
 * Extrait le message d'erreur lisible.
 *
 * Priorité :
 *   1. error.message (ApiError, Error JS)
 *   2. error.response.data.message (Axios brut)
 *   3. premier message de error.response.data.errors (422 Laravel)
 *   4. fallback générique par type
 *
 * @returns {string}
 */
export function getErrorMessage(error) {
  if (!error) return 'Une erreur est survenue.';

  // 1. Message direct (ApiError ou Error JS)
  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  // 2. Message du body Laravel (fallback Axios brut)
  const data = error.response?.data;
  if (data?.message && typeof data.message === 'string') {
    return data.message;
  }

  // 3. Première erreur de validation Laravel (422)
  if (data?.errors && typeof data.errors === 'object') {
    const firstField = Object.values(data.errors)[0];
    if (Array.isArray(firstField) && firstField[0]) {
      return firstField[0];
    }
  }

  // 4. Fallback par type
  const type = getErrorType(error);
  const fallbacks = {
    network: 'Impossible de contacter le serveur.',
    server: 'Une erreur est survenue côté serveur.',
    notFound: 'La ressource est introuvable.',
    forbidden: "Tu n'as pas l'autorisation d'accéder à cette ressource.",
    unauthorized: 'Session expirée. Reconnecte-toi.',
    validation: 'Les données saisies sont invalides.',
    generic: 'Une erreur est survenue.',
  };
  return fallbacks[type] || fallbacks.generic;
}