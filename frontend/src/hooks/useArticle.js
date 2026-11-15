// src/hooks/useArticle.js
import { useCallback } from 'react';
import useFetch from './useFetch';
import { fetchArticleBySlug } from '../services/articleService';

export default function useArticle(slug) {
  const fetcher = useCallback((signal) => fetchArticleBySlug(slug, signal), [slug]);
  return useFetch(fetcher, [slug], { enabled: Boolean(slug) });
}