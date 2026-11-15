// src/hooks/useCreator.js
import { useCallback } from 'react';
import useFetch from './useFetch';
import { fetchCreatorBySlug } from '../services/creatorService';

/**
 * Détail d'un créateur (sans les related).
 * Pour la page de profil avec suggestions, utiliser useCreatorProfile.
 */
export default function useCreator(slug) {
  const fetcher = useCallback((signal) => fetchCreatorBySlug(slug, signal), [slug]);
  return useFetch(fetcher, [slug], { enabled: Boolean(slug) });
}