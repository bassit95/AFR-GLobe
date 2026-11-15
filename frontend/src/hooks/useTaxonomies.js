// src/hooks/useTaxonomies.js
import { useEffect, useState } from 'react';
import { fetchCategories, fetchStyles } from '../services/catalogService';
import { fetchCountries } from '../services/locationService';

// Cache module-level : les taxonomies ne changent pas souvent.
// Évite de re-fetch à chaque montage de composant (formulaires, filtres).
const CACHE = {
  countries: null,
  categories: null,
  styles: null,
  loadedAt: 0,
};

const CACHE_TTL = 5 * 60 * 1000; // 5 min

export default function useTaxonomies({ forceRefresh = false } = {}) {
  const [countries, setCountries] = useState(CACHE.countries || []);
  const [categories, setCategories] = useState(CACHE.categories || []);
  const [styles, setStyles] = useState(CACHE.styles || []);
  const [loading, setLoading] = useState(!CACHE.countries);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fresh = Date.now() - CACHE.loadedAt < CACHE_TTL;
    if (!forceRefresh && CACHE.countries && fresh) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [countriesRes, categoriesRes, stylesRes] = await Promise.all([
          fetchCountries({ perPage: 100 }),
          fetchCategories({ perPage: 100 }),
          fetchStyles({ perPage: 100 }),
        ]);

        if (cancelled) return;

        const c = Array.isArray(countriesRes?.data) ? countriesRes.data : [];
        const cat = Array.isArray(categoriesRes?.data) ? categoriesRes.data : [];
        const st = Array.isArray(stylesRes?.data) ? stylesRes.data : [];

        CACHE.countries = c;
        CACHE.categories = cat;
        CACHE.styles = st;
        CACHE.loadedAt = Date.now();

        setCountries(c);
        setCategories(cat);
        setStyles(st);
      } catch (err) {
        if (!cancelled) {
          setError({
            type: err?.type || 'generic',
            message: err?.message || 'Impossible de charger les taxonomies.',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [forceRefresh]);

  return {
    countries,
    categories,
    styles,
    // Styles racine (ceux sans parent) — utiles pour les selects hiérarchiques
    rootStyles: styles.filter((s) => !s.parent_id),
    loading,
    error,
  };
}