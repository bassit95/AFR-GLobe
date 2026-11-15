// src/hooks/useCreators.js
import usePaginatedData from './usePaginatedData';
import { fetchCreators } from '../services/creatorService';
// src/hooks/useCreator.js
import { useCallback } from 'react';
import useFetch from './useFetch';
import { fetchCreatorBySlug } from '../services/creatorService';


const INITIAL_FILTERS = {
  countryOrigin: '',
  countryResidence: '',
  city: '',
  gender: '',
  category: '',
  style: '',
  letter: '',
};

export default function useCreators(options = {}) {
  return usePaginatedData(fetchCreators, INITIAL_FILTERS, {
    perPage: 12,
    ...options,
  });
}

