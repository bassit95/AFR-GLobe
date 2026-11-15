// src/hooks/useCreatorDirectory.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchCreators } from '../services/creatorService';
import { fetchCategories } from '../services/catalogService';
import { fetchCountries } from '../services/locationService';
import { getErrorType, getErrorMessage } from '../utils/errorHelpers';

export default function useCreatorDirectory() {
  const [categories, setCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [creators, setCreators] = useState([]);
  const [meta, setMeta] = useState({ total: 0, last_page: 1, current_page: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQueryState] = useState('');
  const [selectedLetter, setSelectedLetterState] = useState('ALL');
  const [selectedCountry, setSelectedCountryState] = useState('ALL');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState('az');
  const [page, setPage] = useState(1);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // ─────────────────────────────────────────────────────────────
  // 1.1 — Taxonomies (non bloquant)
    // ─────────────────────────────────────────────────────────────
  // 1.1 — Taxonomies (non bloquant)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();   // ✅ AJOUT

    async function loadCatalog() {
      try {
        const [catsRes, countriesRes] = await Promise.all([
          fetchCategories({}, controller.signal),   // ✅ signal
          fetchCountries({}, controller.signal),    // ✅ signal
        ]);

        if (isMounted) {
          setCategories(Array.isArray(catsRes?.data) ? catsRes.data : []);
          setCountries(Array.isArray(countriesRes?.data) ? countriesRes.data : []);
        }
      } catch (err) {
        // ✅ NE PAS LOGGER LES ABANDONS (StrictMode, navigation)
        if (
          err?.type === 'canceled' ||
          err?.name === 'CanceledError' ||
          err?.name === 'AbortError' ||
          controller.signal.aborted
        ) {
          return;
        }
        // ✅ Ne logger qu'en DEV
        if (import.meta.env.DEV) {
          console.warn('Catalogue indisponible (non bloquant):', err?.message);
        }
      }
    }

    loadCatalog();
    return () => {
      isMounted = false;
      controller.abort();   // ✅ abort au unmount
    };
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 1.2 — Fetch creators
  //   ✅ FIX B3 : page forcée à 1 quand filtres changent (via setters)
  //   ✅ FIX B4 : plus de normalize() → query.trim() brut
  //   ✅ FIX B5 : category_ids[] (array) au lieu de category (int)
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCreators(
          {
            // ✅ FIX B4 — On envoie la requête brute, pas normalisée
            search: query.trim() || undefined,
            letter: selectedLetter !== 'ALL' ? selectedLetter : undefined,
            countryOrigin:
              selectedCountry !== 'ALL' ? selectedCountry : undefined,
            // ✅ FIX B5 — Array d'IDs (backend doit accepter category_ids)
            category_ids:
              selectedCategories.length > 0 ? selectedCategories : undefined,
            page,
            perPage: 12,
          },
          controller.signal
        );

        if (isMounted) {
          setCreators(Array.isArray(data?.data) ? data.data : []);
          setMeta(data?.meta || { total: 0, last_page: 1, current_page: 1 });
        }
      } catch (err) {
        if (
          isMounted &&
          err.name !== 'CanceledError' &&
          err.name !== 'AbortError'
        ) {
          setError({
            type: getErrorType(err),
            message: getErrorMessage(err),
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }, 300);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      controller.abort();
    };
    // ⚠️ sortOrder VOLONTAIREMENT absent : tri client-side
  }, [query, selectedLetter, selectedCountry, selectedCategories, page]);

  // ─────────────────────────────────────────────────────────────
  // 1.3 — Tri côté client
  // ─────────────────────────────────────────────────────────────
  const sortedCreators = useMemo(() => {
    if (!Array.isArray(creators) || creators.length === 0) return creators;

    const copy = [...creators];
    if (sortOrder === 'za') {
      return copy.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    }
    // 'az' + 'recent' (fallback)
    return copy.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [creators, sortOrder]);

  // ─────────────────────────────────────────────────────────────
  // 1.4 — Setters wrappers
  //   ✅ FIX B3 : setPage(1) systématique quand un filtre change
  // ─────────────────────────────────────────────────────────────
  const setQuery = useCallback((value) => {
    setQueryState(value);
    setPage(1);
  }, []);

  const setSelectedLetter = useCallback((value) => {
    setSelectedLetterState(value);
    setPage(1);
  }, []);

  const setSelectedCountry = useCallback((value) => {
    setSelectedCountryState(value);
    setPage(1);
  }, []);

  const toggleCategory = useCallback((id) => {
    setPage(1);
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setQueryState('');
    setSelectedLetterState('ALL');
    setSelectedCountryState('ALL');
    setSelectedCategories([]);
    setSortOrder('az');
    setPage(1);
    setShowAllCategories(false);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // 1.5 — Dérivés
  // ─────────────────────────────────────────────────────────────
  const hasActiveFilters = Boolean(
    query.trim() ||
      selectedLetter !== 'ALL' ||
      selectedCountry !== 'ALL' ||
      selectedCategories.length ||
      sortOrder !== 'az'
  );

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 8);

  return {
    categories,
    countries,
    creators: sortedCreators,
    meta,
    loading,
    error,
    query,
    setQuery,
    selectedLetter,
    setSelectedLetter,
    selectedCountry,
    setSelectedCountry,
    selectedCategories,
    toggleCategory,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    hasActiveFilters,
    resetFilters,
    visibleCategories,
    showAllCategories,
    toggleShowAllCategories: () => setShowAllCategories((prev) => !prev),
  };
}