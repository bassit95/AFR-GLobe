// src/hooks/useArticles.js
import usePaginatedData from './usePaginatedData';
import { fetchArticles } from '../services/articleService';

const INITIAL_FILTERS = {
  type: '',       // ⚠️ ignoré backend (article_type non exposé)
  authorId: '',
};

export default function useArticles(options = {}) {
  return usePaginatedData(fetchArticles, INITIAL_FILTERS, {
    perPage: 12,
    ...options,
  });
}

