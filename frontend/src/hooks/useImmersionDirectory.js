// src/hooks/useImmersionDirectory.js
import { useCallback, useEffect, useState } from 'react';
import { fetchBoutiques } from '../services/boutiqueService';
import { fetchCities, fetchCountries } from '../services/locationService';
import { normalizeBoutique } from '../utils/immersionHelpers';
import usePaginatedData from './usePaginatedData';

const ALL = 'all';

/** Ne pas envoyer 'all' ou '' au backend — utiliser undefined */
function cleanFilter(value) {
  if (!value || value === ALL) return undefined;
  return value;
}

// Wrapper stable (useCallback deps=[]) : la fonction ne change jamais d'identité,
// sinon usePaginatedData boucle à l'infini via son useEffect.
const wrappedFetchBoutiques = async (params, signal) => {
  const response = await fetchBoutiques(
    {
      search: params.search,
      countryId: cleanFilter(params.countryId),
      cityId: cleanFilter(params.cityId),
      type: cleanFilter(params.type),
      page: params.page,
      perPage: params.per_page,
    },
    signal
  );

  const items = Array.isArray(response?.data)
    ? response.data.map((b, i) => normalizeBoutique(b, i))
    : [];

  return { ...response, data: items };
};

export default function useImmersionDirectory() {
  // Directory paginé (état source de vérité)
  const directory = usePaginatedData(
    wrappedFetchBoutiques,
    { countryId: ALL, cityId: ALL, type: ALL },
    { perPage: 20, debounceMs: 300 }
  );

  const { filters, setFilter, setPage, refetch } = directory;

  // Options pour les selects
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [optionsError, setOptionsError] = useState(null);

  // Charger les pays (une fois)
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    fetchCountries({ perPage: 100 }, controller.signal)
      .then((res) => {
        if (!cancelled) setCountries(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((err) => {
        if (!cancelled && err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setOptionsError(err.message || 'Impossible de charger les pays.');
        }
      });

    return () => { cancelled = true; controller.abort(); };
  }, []);

  // Charger les villes quand le pays change
  useEffect(() => {
    if (filters.countryId === ALL) {
      setCities([]);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();

    fetchCities({ countryId: filters.countryId, perPage: 100 }, controller.signal)
      .then((res) => {
        if (!cancelled) setCities(Array.isArray(res?.data) ? res.data : []);
      })
      .catch((err) => {
        if (!cancelled && err.name !== 'CanceledError' && err.name !== 'AbortError') {
          setCities([]);
        }
      });

    return () => { cancelled = true; controller.abort(); };
  }, [filters.countryId]);

  // Setters stabilisés (cascade UX)
  const setCountryId = useCallback(
    (value) => {
      setFilter('countryId', value);
      setFilter('cityId', ALL);   // reset ville quand pays change
    },
    [setFilter]
  );

  const setCityId = useCallback(
    (value) => setFilter('cityId', value),
    [setFilter]
  );

  const setType = useCallback(
    (value) => setFilter('type', value),
    [setFilter]
  );

  const resetFilters = useCallback(() => {
    directory.resetFilters();
    setCities([]);
  }, [directory]);

  // Label de compteur
  const total = Number(directory.meta?.total || 0);
  const countLabel = `${total} ${total > 1 ? 'adresses' : 'adresse'}`;

  return {
    // ─── Recherche ───
    searchInput: directory.searchInput,
    setSearchInput: directory.setSearchInput,

    // ─── Filtres (top-level, contrat de la page) ───
    countryId: filters.countryId,
    setCountryId,
    cityId: filters.cityId,
    setCityId,
    type: filters.type,
    setType,

    // ─── Pagination ───
    page: directory.page,
    setPage,

    // ─── Options selects ───
    countries,
    cities,
    optionsError,

    // ─── Données ───
    boutiques: directory.data,
    meta: directory.meta,
    countLabel,

    // ─── États ───
    loading: directory.loading,
    error: directory.error,
    demoMode: false,  // pas de mode démo : on utilise le vrai backend

    // ─── Actions ───
    resetFilters,
    retry: refetch,   // rejoue la requête courante sans reset de page
  };
}