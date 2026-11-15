// src/hooks/useBrands.js
import usePaginatedData from './usePaginatedData';
import { fetchBrands } from '../services/brandService';

const INITIAL_FILTERS = {
  countryId: '',
  cityId: '',
  creatorId: '',
};

export default function useBrands(options = {}) {
  return usePaginatedData(fetchBrands, INITIAL_FILTERS, {
    perPage: 12,
    ...options,
  });
}

