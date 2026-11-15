// src/hooks/useCategories.js
import usePaginatedData from './usePaginatedData';
import { fetchCategories } from '../services/catalogService';

const INITIAL_FILTERS = {};

export default function useCategories(options = {}) {
  return usePaginatedData(fetchCategories, INITIAL_FILTERS, { perPage: 100, ...options });
}