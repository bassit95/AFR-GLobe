// src/hooks/useCollection.js
import { useCallback } from 'react';
import useFetch from './useFetch';
import { fetchCollectionBySlug } from '../services/collectionService';

export default function useCollection(slug) {
  const fetcher = useCallback(
    (signal) => fetchCollectionBySlug(slug, signal),
    [slug]
  );
  return useFetch(fetcher, [slug], { enabled: Boolean(slug) });
}