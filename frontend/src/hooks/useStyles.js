// src/hooks/useStyles.js
import usePaginatedData from './usePaginatedData';
import { fetchStyles } from '../services/catalogService';

const INITIAL_FILTERS = {};

export default function useStyles(options = {}) {
  return usePaginatedData(fetchStyles, INITIAL_FILTERS, { perPage: 100, ...options });
}