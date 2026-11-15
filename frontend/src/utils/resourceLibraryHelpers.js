// src/utils/resourceLibraryHelpers.js

// ═════════════════════════════════════════════════════════════
// EXPORT 1 — image de secours
// ═════════════════════════════════════════════════════════════
export const FALLBACK_IMAGE = '/images/home/library-01.jpeg';

// ═════════════════════════════════════════════════════════════
// EXPORT 2 — getImage
// ═════════════════════════════════════════════════════════════
export function getImage(item) {
  if (!item) return FALLBACK_IMAGE;
  return item.coverImage || FALLBACK_IMAGE;
}

// ═════════════════════════════════════════════════════════════
// EXPORT 3 — catégories pour les filtres
// ═════════════════════════════════════════════════════════════
export const RESOURCE_LIBRARY_CATEGORIES = [
  { value: 'all', label: 'Tout explorer' },
  { value: 'culture', label: 'Culture & héritage' },
  { value: 'savoir-faire', label: 'Savoir-faire' },
  { value: 'actualite', label: 'Actualités' },
  { value: 'portrait', label: 'Portraits' },
  { value: 'analyse', label: 'Analyses' },
  { value: 'guide', label: 'Guides & ressources' },
];

// ═════════════════════════════════════════════════════════════
// EXPORT 4 — ✅ TA FONCTION, INCHANGÉE, GARDÉE TELLE QUELLE
// ═════════════════════════════════════════════════════════════
export function normalizeCategory(value = '') {
  const normalized = String(value).toLowerCase().trim().replace(/[_\s]+/g, '-');
  const aliases = {
    heritage: 'culture',
    history: 'culture',
    histoire: 'culture',
    culture: 'culture',
    craft: 'savoir-faire',
    savoirfaire: 'savoir-faire',
    'savoir-faire': 'savoir-faire',
    news: 'actualite',
    actualites: 'actualite',
    actualité: 'actualite',
    actualités: 'actualite',
    interview: 'portrait',
    portraits: 'portrait',
    analysis: 'analyse',
    guides: 'guide',
    resource: 'guide',
    resources: 'guide',
    designer: 'guide',
  };
  return aliases[normalized] || normalized || 'guide';
}

// ═════════════════════════════════════════════════════════════
// EXPORT 5 — getCategoryLabel (❌ CELUI QUI MANQUE)
// ═════════════════════════════════════════════════════════════
export function getCategoryLabel(value) {
  const category = normalizeCategory(value);   // ← utilise TA fonction
  const found = RESOURCE_LIBRARY_CATEGORIES.find(
    (item) => item.value === category
  );
  return found?.label || 'À découvrir';
}

// ═════════════════════════════════════════════════════════════
// EXPORT 6 — formatPublicationDate
// ═════════════════════════════════════════════════════════════
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

// ═════════════════════════════════════════════════════════════
// EXPORT 7 — estimateReadingTime
// ═════════════════════════════════════════════════════════════
export function estimateReadingTime(content = '') {
  const text = String(content).replace(/[#>*_`\-]/g, ' ').trim();
  if (!text) return 1;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(wordCount / 200));
}