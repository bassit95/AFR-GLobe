// src/pages/SearchResults.jsx
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import SearchHero from '@/components/search/SearchHero';
import useSearch from '@/hooks/useSearch';
import { imageUrl } from '@/utils/image';

// 🎯 LES FONCTIONS MANQUANTES SONT DE RETOUR ICI
function extractList(maybeWrapped) {
  if (Array.isArray(maybeWrapped)) return maybeWrapped;
  if (Array.isArray(maybeWrapped?.data)) return maybeWrapped.data;
  return [];
}

const SECTION_LABELS = {
  creators: 'Créateurs',
  brands: 'Marques',
  articles: 'Articles',
  collections: 'Collections',
  products: 'Produits',
};

function itemLink(type, item) {
  if (type === 'creators' && item?.slug) return `/creators/${item.slug}`;
  if (type === 'brands' && item?.slug) return `/marques/${item.slug}`;
  if (type === 'articles' && item?.slug) return `/resources/${item.slug}`;
  if (type === 'collections' && (item?.slug || item?.id)) return `/collections/${item.slug || item.id}`;
  if (type === 'products' && (item?.slug || item?.id)) return `/produits/${item.slug || item.id}`;
  return '#';
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const { results, loading, error, query, isReady } = useSearch(initialQuery);

  const allListsEmpty = ['creators', 'brands', 'articles', 'collections', 'products'].every(
    (type) => extractList(results?.[type]).length === 0
  );

  return (
    <main className="min-h-screen bg-[#F9F8F6]">
      {/* 1. Le Hero avec la barre de recherche */}
      <SearchHero initialQuery={initialQuery} />

      {/* 2. Les Résultats (avec marge en haut pt-12) */}
      <div className="max-w-4xl mx-auto py-16 px-6 pt-12">
        {!isReady && (
          <p className="text-center text-gray-500 italic py-10">Tapez au moins 2 caractères pour lancer la recherche.</p>
        )}

        {isReady && loading && (
          <p className="text-center text-[#B85C38] font-bold uppercase tracking-widest animate-pulse py-10">Recherche en cours…</p>
        )}

        {isReady && error && (
          <p className="text-center text-red-500 py-10">{error.message}</p>
        )}

        {isReady && !loading && !error && results && (
          <div className="space-y-12">
            {['creators', 'brands', 'articles', 'collections', 'products'].map((type) => {
              const list = extractList(results?.[type]);
              if (list.length === 0) return null;

              return (
                <section key={type}>
                  <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#B85C38] mb-4 border-b border-black/10 pb-2">
                    {SECTION_LABELS[type]} ({list.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {list.map((item) => (
                      <Link
                        key={`${type}-${item.id}`}
                        to={itemLink(type, item)}
                        className="group flex items-center gap-4 p-3 border border-black/5 hover:border-[#B85C38] hover:bg-white transition-all bg-white/50"
                      >
                        <div className="w-14 h-14 bg-gray-100 flex-shrink-0 overflow-hidden rounded-sm">
                          <img
                            src={imageUrl(item.profile_image || item.logo || item.image || item.cover_image)}
                            alt={item.name || item.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#1A1A1A] truncate group-hover:text-[#B85C38] transition-colors">
                            {item.name || item.title}
                          </p>
                          {type === 'collections' && item.brand && (
                            <p className="text-xs text-gray-500 truncate mt-0.5">{item.brand.name}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}

            {allListsEmpty && (
              <div className="text-center py-16 border border-dashed border-gray-300">
                <p className="text-lg font-['Playfair_Display'] italic text-gray-500">
                  Aucun résultat trouvé pour "{query}".
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}