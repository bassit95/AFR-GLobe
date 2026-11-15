// src/hooks/usePortfolioItem.js
import { useCallback } from 'react';
import useFetch from './useFetch';
import { fetchPortfolioItem } from '../services/portfolioService';

export default function usePortfolioItem(id) {
  const fetcher = useCallback(
    (signal) => fetchPortfolioItem(id, signal),
    [id]
  );
  return useFetch(fetcher, [id], { enabled: Boolean(id) });
}