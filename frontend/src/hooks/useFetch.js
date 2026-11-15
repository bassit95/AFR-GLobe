// src/hooks/useFetch.js
import { useCallback, useEffect, useState } from 'react';

/**
 * Fetch unique (non paginé) pour les pages de détail.
 *
 * @param {(signal) => Promise<any>} fetcher
 *        Doit retourner `{ success, data, meta? }` ou directement la payload.
 * @param {any[]} deps  — dépendances déclenchant un refetch (ex: [slug])
 * @param {object} options { enabled, initialData }
 *
 * @returns { data, loading, error, refetch }
 */
export default function useFetch(fetcher, deps = [], options = {}) {
  const { enabled = true, initialData = null } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [refetchKey, setRefetchKey] = useState(0);

  const refetch = useCallback(() => setRefetchKey((k) => k + 1), []);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetcher(controller.signal);
        if (cancelled) return;
        // Tolère : payload direct OU { data: payload }
        setData(response?.data ?? response ?? null);
      } catch (err) {
        if (cancelled) return;
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') return;
        setError({
          type: err?.type || 'generic',
          message: err?.message || 'Une erreur est survenue.',
          fields: err?.fields || null,
          status: err?.status || 0,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [enabled, refetchKey, ...deps]);

  return { data, loading, error, refetch };
}