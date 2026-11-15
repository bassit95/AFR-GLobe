// src/services/articleService.js
import api from './api';

/**
 * Liste des articles publiés.
 * ⚠️ Backend n'expose pas encore article_type dans IndexArticleRequest.
 *    On le forward quand même (silencieusement ignoré aujourd'hui).
 */
export async function fetchArticles(params = {}, signal) {
  const { data } = await api.get('/articles', {
    params: {
      search: params.search,
      author_id: params.authorId,
      article_type: params.type,
      page: params.page || 1,
      per_page: params.perPage || 12,
    },
    signal,
  });
  return data;
}

/**
 * Détail par slug (route: `articles/{article:slug}`).
 */
export async function fetchArticleBySlug(slug, signal) {
  const { data } = await api.get(`/articles/${slug}`, { signal });
  return data;
}

// ADMIN
// payload: {
//   title, slug, excerpt, content, cover_image, author_id,
//   published_at, status, source_ids: number[]
//   + article_type (⚠️ backend à activer)
// }
export async function createArticle(payload) {
  const { data } = await api.post('/articles', payload);
  return data;
}
export async function updateArticle(id, payload) {
  const { data } = await api.put(`/articles/${id}`, payload);
  return data;
}
export async function deleteArticle(id) {
  const { data } = await api.delete(`/articles/${id}`);
  return data;
}