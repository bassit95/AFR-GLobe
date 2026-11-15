// src/hooks/usePaginatedData.js
import { useCallback, useEffect, useRef, useState } from 'react';
import useDebounce from './useDebounce';

/**
 * Hook générique pour toutes les listes paginées.
 *
 * @param {(params, signal) => Promise<{data:any[], meta:any}>} fetchFunction
 * @param {object} initialFilters
 * @param {object} options { perPage, initialSearch, debounceMs, enabled, extraFilters }
 *
 * `extraFilters` : filtres forcés côté hook (ex: { status: 'all' } pour l'admin).
 *   Ils sont stables (ref) pour éviter les boucles infinies de useEffect.
 */
export default function usePaginatedData(fetchFunction, initialFilters = {}, options = {}) {
  const {
    perPage = 15,
    initialSearch = '',
    debounceMs = 300,
    enabled = true,
    extraFilters = {},   // ✅ Filtres forcés (admin, ex: status=all)
  } = options;

  // ✅ ÉTATS — TOUS DÉCLARÉS AVANT TOUTE UTILISATION
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: perPage,
    total: 0,
  });
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [filters, setFiltersState] = useState(initialFilters);

  const [refetchKey, setRefetchKey] = useState(0);

  const search = useDebounce(searchInput.trim(), debounceMs);

  const last = useRef({ search: null, filters: null });

  // ✅ extraFilters stable via ref (évite les boucles infinies)
  const extraFiltersRef = useRef(extraFilters);
  useEffect(() => {
    extraFiltersRef.current = extraFilters;
  }, [extraFilters]);

  // ✅ EFFET DE FETCH
  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    const filtersChanged = last.current.filters !== filters;
    const searchChanged = last.current.search !== search;

    // Reset page si filtre/recherche change
    if ((filtersChanged || searchChanged) && page !== 1) {
      setPage(1);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchFunction(
          {
            page,
            per_page: perPage,
            search: search || undefined,
            ...filters,
            ...extraFiltersRef.current,   // ✅ Fusion des filtres forcés
          },
          controller.signal
        );
        if (cancelled) return;

        last.current = { search, filters };
        setData(response?.data || []);
        setMeta(
          response?.meta || {
            current_page: 1,
            last_page: 1,
            per_page: perPage,
            total: 0,
          }
        );
      } catch (err) {
        if (
          !cancelled &&
          err.name !== 'CanceledError' &&
          err.name !== 'AbortError'
        ) {
          setError(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [fetchFunction, page, search, filters, perPage, enabled, refetchKey]);

  // ✅ SETTERS
  const setFilter = useCallback((key, value) => {
    setFiltersState((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setFilters = useCallback((next) => setFiltersState(next), []);

  const resetFilters = useCallback(() => {
    setFiltersState(initialFilters);
    setSearchInput('');
    setPage(1);
  }, [initialFilters]);

  const refetch = useCallback(() => {
    setRefetchKey((k) => k + 1);
  }, []);

  return {
    data,
    meta,
    loading,
    error,
    page,
    setPage,
    searchInput,
    setSearchInput,
    filters,
    setFilter,
    setFilters,
    resetFilters,
    refetch,
    isEmpty: !loading && data.length === 0,
  };
}