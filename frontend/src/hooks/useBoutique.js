// src/hooks/useBoutique.js
import { useCallback } from 'react';
import useFetch from './useFetch';
import { fetchBoutique } from '../services/boutiqueService';

export default function useBoutique(id) {
  const fetcher = useCallback(
    (signal) => fetchBoutique(id, signal),
    [id]
  );
  return useFetch(fetcher, [id], { enabled: Boolean(id) });
}