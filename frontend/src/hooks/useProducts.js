// src/hooks/useProducts.js
import usePaginatedData from './usePaginatedData';
import { fetchProducts } from '../services/productService';

const INITIAL_FILTERS = {
  brandId: '',
  collectionId: '',
  categoryId: '',
  styleId: '',
  gender: '',
  availability: '',
};

export default function useProducts(options = {}) {
  return usePaginatedData(fetchProducts, INITIAL_FILTERS, {
    perPage: 12,
    ...options,
  });
}