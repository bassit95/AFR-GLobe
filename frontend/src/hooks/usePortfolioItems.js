// src/hooks/usePortfolioItems.js
import usePaginatedData from './usePaginatedData';
import { fetchPortfolioItems } from '../services/portfolioService';

const INITIAL_FILTERS = {
  creatorId: '',
  collectionId: '',
  year: '',
};

export default function usePortfolioItems(options = {}) {
  return usePaginatedData(fetchPortfolioItems, INITIAL_FILTERS, {
    perPage: 12,
    ...options,
  });
}