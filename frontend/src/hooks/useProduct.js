// src/hooks/useProduct.js
import { useCallback } from 'react';
import useFetch from './useFetch';
import { fetchProductBySlug } from '../services/productService';

export default function useProduct(slug) {
  const fetcher = useCallback(
    (signal) => fetchProductBySlug(slug, signal),
    [slug]
  );
  return useFetch(fetcher, [slug], { enabled: Boolean(slug) });
}