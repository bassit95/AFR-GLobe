// src/hooks/useFeaturedResources.js
import { useEffect, useState } from 'react';
import { fetchArticles } from '../services/articleService';
import { imageUrl } from '../utils/image';
import { normalizeCategory } from '../utils/resourceLibraryHelpers';

/**
 * Récupère les N articles les plus récents, prêts à afficher.
 * Retourne { resources, loading, error } — shape alignée sur ResourceLibraryPreview.
 *
 * @param {number} limit — nombre max d'articles (défaut 3)
 */
export default function useFeaturedResources(limit = 3) {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchArticles({ perPage: limit, page: 1 }, controller.signal)
      .then((response) => {
        if (controller.signal.aborted) return;

        const rows = Array.isArray(response?.data) ? response.data : [];
        const mapped = rows.slice(0, limit).map((article) => ({
          id: article.id,
          slug: article.slug,
          title: article.title || 'Article sans titre',
          excerpt: article.excerpt || '',
          // ⚠️ article_type n'est pas exposé par ArticleResource (bug backend).
          //    Fallback 'culture' pour tous les articles seedés.
          category: normalizeCategory(article.article_type || 'culture'),
          coverImage: imageUrl(article.cover_image),
          publishedAt: article.published_at || null,
        }));

        setResources(mapped);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError({
          type: err?.type || 'generic',
          message: err?.message || 'Impossible de charger les articles à la une.',
        });
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [limit]);

  return { resources, loading, error };
}