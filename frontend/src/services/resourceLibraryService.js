import api from './api';
import { imageUrl } from '../utils/image';

const DEFAULT_PER_PAGE = 100;
const MAX_PAGES = 50;

// 🎯 1. Extraction des données (Axios renvoie déjà response.data)
function extractRows(payload) {
  const candidates = [
    payload?.data?.data,
    payload?.data,
    payload?.items,
    payload?.results,
    payload,
  ];
  const rows = candidates.find(Array.isArray) || [];
  const meta = payload?.meta || payload?.data?.meta || payload?.data?.data?.meta || {};
  return { rows, meta };
}

// 🎯 2. Pagination avec Axios
async function fetchAllPages(endpoint, { signal, perPage = DEFAULT_PER_PAGE } = {}) {
  const allRows = [];
  let page = 1;

  while (page <= MAX_PAGES) {
    // Axios gère les paramètres et l'annulation (signal) nativement
    const response = await api.get(`/${endpoint.replace(/^\/+/, '')}`, {
      params: { page, per_page: perPage },
      signal,
    });
    
    const { rows, meta } = extractRows(response.data);
    allRows.push(...rows);

    const lastPage = Number(meta?.last_page || 0);
    if (lastPage > 0) {
      if (page >= lastPage) break;
    } else if (rows.length < perPage) {
      break;
    }

    if (rows.length === 0) break;
    page += 1;
  }

  return allRows;
}

// 🎯 3. Mapping (on utilise imageUrl de api.js au lieu de toPublicImageUrl)
function mapArticle(article) {
  return {
    ...article,
    id: `article-${article.id ?? article.slug}`,
    recordId: article.id,
    kind: 'article',
    slug: article.slug,
    title: article.title || 'Article sans titre',
    excerpt: article.excerpt || '',
    content: article.content || '',
    category: article.article_type || article.category || 'culture',
    coverImage: imageUrl(article.cover_image),
    publishedAt: article.published_at || article.created_at || null,
    externalUrl: '',
    sources: Array.isArray(article.sources) ? article.sources : [],
  };
}

function mapResource(resource) {
  return {
    ...resource,
    id: `resource-${resource.id ?? resource.slug}`,
    recordId: resource.id,
    kind: 'resource',
    slug: resource.slug,
    title: resource.title || 'Ressource sans titre',
    excerpt: resource.description || '',
    content: resource.description || '',
    category: resource.resource_type || 'guide',
    coverImage: imageUrl(resource.cover_image),
    publishedAt: resource.published_at || resource.created_at || null,
    externalUrl: resource.url || '',
    sources: [],
  };
}

// 🎯 4. Récupération de la bibliothèque
export async function getLibraryContent({ signal } = {}) {
  try {
    const [articlesData, resourcesData] = await Promise.all([
      fetchAllPages('articles', { signal }),
      fetchAllPages('resources', { signal }),
    ]);

    const articles = articlesData.filter(r => !r.status || r.status === 'published').map(mapArticle);
    const resources = resourcesData.filter(r => !r.status || r.status === 'published').map(mapResource);

    const items = [...articles, ...resources];
    items.sort((a, b) => {
      const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return dateB - dateA;
    });

    return { items, warnings: [] };
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'CanceledError') throw error;
    
    // En cas d'erreur partielle (ex: articles marchent mais pas ressources), on gère
    throw new Error(`Impossible de charger la bibliothèque : ${error.message}`);
  }
}

// 🎯 5. Récupération d'un article par SLUG (Correction du problème de route)
export async function getArticleBySlug(slug, { signal } = {}) {
  if (!slug) throw new Error('Le slug de l’article est absent.');

  try {
    // 🎯 On utilise la nouvelle route Laravel : GET /articles/{slug}
    const response = await api.get(`/articles/${encodeURIComponent(slug)}`, { signal });
    
    // Laravel renvoie { success: true, data: { ... } }
    const article = response.data?.data || response.data;
    
    if (!article || !article.slug) {
      throw new Error('Format de réponse inattendu.');
    }
    
    return mapArticle(article);
  } catch (error) {
    if (error.name === 'AbortError' || error.name === 'CanceledError') throw error;
    
    // Si l'API renvoie 404, on affiche un message propre
    if (error.response?.status === 404) {
      throw new Error('Cet article n’existe pas ou n’est pas publié.');
    }
    
    throw new Error(error.response?.data?.message || error.message || 'Impossible de charger l’article.');
  }
}

// --- Fonctions utilitaires inchangées ---

export const RESOURCE_LIBRARY_CATEGORIES = [
  { value: 'all', label: 'Tout explorer' },
  { value: 'culture', label: 'Culture & héritage' },
  { value: 'savoir-faire', label: 'Savoir-faire' },
  { value: 'actualite', label: 'Actualités' },
  { value: 'portrait', label: 'Portraits' },
  { value: 'analyse', label: 'Analyses' },
  { value: 'guide', label: 'Guides & ressources' },
];

export function normalizeCategory(value = '') {
  const normalized = String(value).toLowerCase().trim().replace(/[_\s]+/g, '-');
  const aliases = {
    heritage: 'culture', history: 'culture', histoire: 'culture', culture: 'culture',
    craft: 'savoir-faire', savoirfaire: 'savoir-faire', 'savoir-faire': 'savoir-faire',
    news: 'actualite', actualites: 'actualite', actualité: 'actualite', actualités: 'actualite',
    interview: 'portrait', portraits: 'portrait', analysis: 'analyse',
    guides: 'guide', resource: 'guide', resources: 'guide',
  };
  return aliases[normalized] || normalized || 'guide';
}

export function getCategoryLabel(value) {
  const category = normalizeCategory(value);
  return RESOURCE_LIBRARY_CATEGORIES.find((item) => item.value === category)?.label || 'À découvrir';
}

export function formatPublicationDate(value) {
  if (!value) return 'Date non précisée';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date non précisée';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}