// src/hooks/useCollections.js
import usePaginatedData from './usePaginatedData';
import { fetchCollections } from '../services/collectionService';

const INITIAL_FILTERS = {
  brandId: '',
  year: '',
  season: '',
};

export default function useCollections(options = {}) {
  return usePaginatedData(fetchCollections, INITIAL_FILTERS, {
    perPage: 12,
    ...options,
  });
}