// src/hooks/useSearch.js
import { useEffect, useState } from 'react';
import useDebounce from './useDebounce';
import { fetchSearch } from '../services/searchService';

/**
 * Recherche globale avec debounce + abort.
 * Backend exige 2 caractères minimum — en dessous, results = null.
 */
export default function useSearch(query, { debounceMs = 300 } = {}) {
  const debounced = useDebounce(query, debounceMs);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const trimmed = String(debounced ?? '').trim();

    if (trimmed.length < 2) {
      setResults(null);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchSearch(trimmed, controller.signal);
        if (cancelled) return;
        setResults(response?.data ?? null);
      } catch (err) {
        if (cancelled) return;
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
        setError({
          type: err?.type || 'generic',
          message: err?.message || 'La recherche est momentanément indisponible.',
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [debounced]);

  return {
    results, // { creators, brands, products } ou null
    loading,
    error,
    query: debounced,
    isReady: String(debounced ?? '').trim().length >= 2,
  };
}