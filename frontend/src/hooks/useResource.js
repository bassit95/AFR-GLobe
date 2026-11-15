// src/hooks/useResource.js
import { useCallback } from 'react';
import useFetch from './useFetch';
import { fetchResourceBySlug } from '../services/resourceService';

export default function useResource(slug) {
  const fetcher = useCallback(
    (signal) => fetchResourceBySlug(slug, signal),
    [slug]
  );
  return useFetch(fetcher, [slug], { enabled: Boolean(slug) });
}