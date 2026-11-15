// src/hooks/useBoutiques.js
import usePaginatedData from './usePaginatedData';
import { fetchBoutiques } from '../services/boutiqueService';

const INITIAL_FILTERS = {
  brandId: '',
  countryId: '',
  cityId: '',
  type: '',
};

export default function useBoutiques(options = {}) {
  return usePaginatedData(fetchBoutiques, INITIAL_FILTERS, {
    perPage: 20,
    ...options,
  });
}

