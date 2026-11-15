// src/services/productService.js
import api from './api';

export async function fetchProducts(params = {}, signal) {
  const { data } = await api.get('/products', {
    params: {
      search: params.search,
      brand_id: params.brandId,
      collection_id: params.collectionId,
      category_id: params.categoryId,
      style_id: params.styleId,
      gender: params.gender,
      availability: params.availability,
      page: params.page || 1,
      per_page: params.perPage || 12,
    },
    signal,
  });
  return data;
}

export async function fetchProductBySlug(slug, signal) {
  const { data } = await api.get(`/products/${slug}`, { signal });
  return data;
}

// payload: {
//   brand_id, collection_id, name, slug, description, image,
//   price, currency, gender, product_url, availability, status,
//   category_ids: number[], style_ids: number[]
// }
export async function createProduct(payload) {
  const { data } = await api.post('/products', payload);
  return data;
}
export async function updateProduct(slug, payload) {
  const { data } = await api.put(`/products/${slug}`, payload);
  return data;
}
export async function deleteProduct(slug) {
  const { data } = await api.delete(`/products/${slug}`);
  return data;
}