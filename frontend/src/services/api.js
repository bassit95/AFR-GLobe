// src/services/api.js
import axios from 'axios';

export class ApiError extends Error {
  constructor(message, { type = 'generic', status = 0, raw = null, fields = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
    this.raw = raw;
    this.fields = fields;
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,   // ✅ 30s au lieu de 15s (dev backend lent)
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ DÉTECTER LES ABANDONS EN PREMIER (StrictMode, navigation, timeout)
    if (
      error.name === 'CanceledError' ||
      error.name === 'AbortError' ||
      error.code === 'ERR_CANCELED'
    ) {
      return Promise.reject(
        new ApiError('Requête annulée.', { type: 'canceled', raw: error })
      );
    }

    // ✅ Détecter les timeouts axios
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return Promise.reject(
        new ApiError('Le serveur met trop de temps à répondre.', {
          type: 'network',
          raw: error,
        })
      );
    }

    // Erreur réseau réelle (pas d'response, pas d'abandon)
    if (!error.response) {
      return Promise.reject(
        new ApiError('Impossible de contacter le serveur.', {
          type: 'network',
          raw: error,
        })
      );
    }

    const { status, data } = error.response;

    if (status === 401) {
      localStorage.removeItem('auth_token');
      return Promise.reject(
        new ApiError(data?.message || 'Session expirée.', {
          type: 'unauthorized',
          status,
          raw: error,
        })
      );
    }

    if (status === 419) {
      return Promise.reject(
        new ApiError('Session expirée (CSRF). Rafraîchis la page.', {
          type: 'csrf',
          status,
          raw: error,
        })
      );
    }

    if (status === 403) {
      return Promise.reject(
        new ApiError(data?.message || "Accès refusé.", {
          type: 'forbidden',
          status,
          raw: error,
        })
      );
    }

    if (status === 404) {
      return Promise.reject(
        new ApiError(data?.message || 'Ressource introuvable.', {
          type: 'notFound',
          status,
          raw: error,
        })
      );
    }

    if (status === 422) {
      const fields = data?.errors && typeof data.errors === 'object' ? data.errors : null;
      const firstError = fields ? Object.values(fields)[0]?.[0] : null;
      return Promise.reject(
        new ApiError(firstError || data?.message || 'Données invalides.', {
          type: 'validation',
          status,
          raw: error,
          fields,
        })
      );
    }

    if (status >= 500) {
      return Promise.reject(
        new ApiError(data?.message || 'Erreur serveur.', {
          type: 'server',
          status,
          raw: error,
        })
      );
    }

    return Promise.reject(
      new ApiError(data?.message || `Erreur HTTP ${status}.`, {
        type: 'generic',
        status,
        raw: error,
      })
    );
  }
);

export default api;