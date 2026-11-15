// src/hooks/useBrand.js
import { useCallback } from 'react';
import useFetch from './useFetch';
import { fetchBrandBySlug } from '../services/brandService';

export default function useBrand(slug) {
  const fetcher = useCallback(
    (signal) => fetchBrandBySlug(slug, signal),
    [slug]
  );
  return useFetch(fetcher, [slug], { enabled: Boolean(slug) });
}