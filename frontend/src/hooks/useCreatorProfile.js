// src/hooks/useCreatorProfile.js
import { useEffect, useState } from 'react';
import { fetchCreatorBySlug, fetchCreators } from '../services/creatorService';
import { getErrorType, getErrorMessage } from '../utils/errorHelpers';

/**
 * @param {string} slug — slug du créateur (backend bind sur {creator:slug})
 */
export default function useCreatorProfile(slug) {
  const [creator, setCreator] = useState(null);
  const [relatedCreators, setRelatedCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        // 1.3 — fetchCreatorBySlug (existait pas avant sous ce nom)
        //        perPage (camelCase), pas per_page
        const [creatorResult, relatedResult] = await Promise.all([
          fetchCreatorBySlug(slug, controller.signal),
          fetchCreators({ perPage: 5 }, controller.signal),
        ]);

        if (!isMounted) return;

        setCreator(creatorResult?.data || null);

        const list = Array.isArray(relatedResult?.data) ? relatedResult.data : [];
        const filtered = list.filter((c) => c.slug !== slug).slice(0, 4);
        setRelatedCreators(filtered);
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
    }

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [slug]);

  return { creator, relatedCreators, loading, error };
}