// src/hooks/useResources.js
import usePaginatedData from './usePaginatedData';
import { fetchResources } from '../services/resourceService';

const INITIAL_FILTERS = {
  resourceType: '',
};

export default function useResources(options = {}) {
  return usePaginatedData(fetchResources, INITIAL_FILTERS, {
    perPage: 20,
    ...options,
  });
}