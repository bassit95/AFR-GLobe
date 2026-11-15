// src/hooks/useResourceLibrary.js
import { useEffect, useMemo, useState } from 'react';
import { getArticleBySlug, getLibraryContent } from '../services/resourceLibraryService';
import { normalizeCategory } from '../utils/resourceLibraryHelpers';

function toErrorShape(err) {
  return {
    type: err?.type || 'generic',
    message: err?.message || 'Une erreur est survenue.',
  };
}

export default function useResourceLibrary(slug) {
  const [items, setItems] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // ← objet { type, message } ou null

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const [detailItem, setDetailItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null); // ← idem

  // ─── Liste ───
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getLibraryContent({ signal: controller.signal })
      .then((result) => {
        if (controller.signal.aborted) return;
        setItems(result.items || []);
        setWarnings(result.warnings || []);
      })
      .catch((err) => {
        // ✅ Fix bug #2 : signal.aborted suffit, pas besoin de tester err.name
        if (controller.signal.aborted) return;
        setError(toErrorShape(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  // ─── Détail ───
  useEffect(() => {
    if (!slug) {
      setDetailItem(null);
      setDetailError(null);
      setDetailLoading(false);
      return undefined;
    }

    const controller = new AbortController();
    setDetailItem(null);
    setDetailError(null);
    setDetailLoading(true);

    getArticleBySlug(slug, { signal: controller.signal })
      .then((item) => {
        if (controller.signal.aborted) return;
        setDetailItem(item);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setDetailError(toErrorShape(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setDetailLoading(false);
      });

    return () => controller.abort();
  }, [slug]);

  // ─── Filtre + tri ───
  const filteredItems = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase('fr');
    const result = items.filter((item) => {
      const category = normalizeCategory(item.category);
      const categoryMatch = activeCategory === 'all' || category === activeCategory;
      const haystack = [item.title, item.excerpt, item.content, item.category, item.kind]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('fr');
      return categoryMatch && (!needle || haystack.includes(needle));
    });

    result.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title, 'fr');
      if (sortBy === 'oldest') return new Date(a.publishedAt || 0) - new Date(b.publishedAt || 0);
      return new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
    });
    return result;
  }, [items, query, activeCategory, sortBy]);

  return {
    items: filteredItems,
    warnings,
    loading,
    error,
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    detailItem,
    detailLoading,
    detailError,
  };
}