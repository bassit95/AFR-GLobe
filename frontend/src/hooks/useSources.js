// src/hooks/useSources.js
import usePaginatedData from './usePaginatedData';
import { fetchSources } from '../services/sourceService';

const INITIAL_FILTERS = {
  sourceType: '',
  publisher: '',
};

export default function useSources(options = {}) {
  return usePaginatedData(fetchSources, INITIAL_FILTERS, {
    perPage: 20,
    ...options,
  });
}