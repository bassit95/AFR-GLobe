// src/pages/ResourceLibrary.jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Clock3, Search, SlidersHorizontal } from 'lucide-react';
import PageBanner from '../components/Cards/PageBanner';
import AfricanMotif from '../components/ui/AfricanMotif';
import ArticleCover from '../components/resources/ArticleCover';
import ResourceCard from '../components/resources/ResourceCard';
import ResourceDetail from '../components/resources/ResourceDetail';
import useResourceLibrary from '../hooks/useResourceLibrary';

// 🎯 IMPORT DES COMPOSANTS D'ÉTAT
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';

import { 
  FALLBACK_IMAGE, 
  estimateReadingTime, 
  formatPublicationDate, 
  getCategoryLabel, 
  RESOURCE_LIBRARY_CATEGORIES 
} from '../utils/resourceLibraryHelpers';

const bannerLibrary = '/images/home/library-01.jpeg';

export default function ResourceLibrary() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const {
    items,
    warnings,
    loading,
    error,
    query, setQuery,
    activeCategory, setActiveCategory,
    sortBy, setSortBy,
    detailItem,
    detailLoading,
    detailError,
  } = useResourceLibrary(slug);

  // 🎯 On définit le PageBanner une seule fois pour toute la page
  const pageBanner = (
    <PageBanner 
      title={slug ? "Article." : "Resource Library."} 
      currentPage="Resource Library" 
      imageUrl={bannerLibrary}
      backTo="/resources"
      backLabel="Bibliothèque" 
      subtitle={slug ? null : "Histoires, savoir-faire et actualités pour comprendre les cultures et les créations africaines."}
    />
  );

  // =====================================================================
  // VUE DÉTAIL (si slug dans l'URL)
  // =====================================================================
  if (slug) {
    if (detailLoading && !detailItem) {
      return (
        <>
          {pageBanner}
          <main className="min-h-[60vh] bg-[#F9F8F6] flex items-center justify-center">
            <LoadingState message="Ouverture de la ressource…" />
          </main>
        </>
      );
    }
    
    if (detailError || !detailItem) {
      return (
        <>
          {pageBanner}
          <main className="min-h-[60vh] bg-[#F9F8F6] flex items-center justify-center px-6">
            <ErrorMessage
              type={detailError?.type || 'notFound'}
              title="Contenu indisponible"
              message={detailError?.message || 'Cette ressource n’a pas été trouvée.'}
              onRetry={() => navigate('/resources')}
            />
          </main>
        </>
      );
    }
    
    return (
      <>
        {pageBanner}
        <ResourceDetail item={detailItem} onBack={() => navigate('/resources')} />
      </>
    );
  }

  // =====================================================================
  // VUE INDEX (Liste des articles)
  // =====================================================================
  const featured = items[0] || null;
  const rest = items.slice(1);

  const openItem = (item) => navigate(`/resources/${item.slug}`);

  const resetFilters = () => {
    setQuery('');
    setActiveCategory('all');
    setSortBy('recent');
  };

  return (
    <>
      {/* 🎯 LE PAGE BANNER EST ICI */}
      {pageBanner}

      <main className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A] font-['Inter']">
        
        {/* === HERO & FILTRES === */}
        <section className="relative overflow-hidden bg-[#F0E8DD] border-b border-[#2E1B20]/10">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full border-[1px] border-[#B85C38]/20 md:h-96 md:w-96" />
          
          <AfricanMotif 
            className="pointer-events-none absolute right-10 top-10 hidden h-40 w-8 opacity-50 md:block" 
            color="#B85C38" 
          />

          <div className="relative max-w-[1440px] mx-auto px-5 md:px-10 py-12 md:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-7">
                <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#8B442A]">
                  <span className="h-px w-8 bg-[#B85C38]" />Centre de connaissance Africa Global
                </p>
                <h1 className="mt-5 max-w-4xl font-serif text-4xl sm:text-5xl md:text-7xl leading-[0.96] tracking-tight text-[#211B18]">
                  Comprendre la création.<br /><span className="italic text-[#B85C38]">Transmettre les histoires.</span>
                </h1>
              </div>
              <div className="lg:col-span-4 lg:col-start-9">
                <p className="text-sm md:text-base leading-7 text-[#64544A]">
                  Une bibliothèque éditoriale pour explorer les héritages culturels, les savoir-faire, les parcours créatifs et les actualités qui font évoluer les scènes africaines et diasporiques.
                </p>
                <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] font-bold text-[#7C432B]">
                  <BookOpen size={15} /> Articles documentés · Sources consultables
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="mt-9 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
              <label className="md:col-span-7 flex items-center gap-3 bg-[#FFFEFC] border border-[#2E1B20]/15 px-4 md:px-5 py-4 focus-within:border-[#B85C38] transition-colors">
                <Search size={19} className="shrink-0 text-[#B85C38]" />
                <span className="sr-only">Rechercher</span>
                <input 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Rechercher une histoire, une matière, un créateur…" 
                  className="w-full bg-transparent outline-none text-sm placeholder:text-[#9C8C80]" 
                />
                {query && (
                  <button type="button" onClick={() => setQuery('')} className="text-xs uppercase tracking-wider text-[#8A6B59] hover:text-[#B85C38]">
                    Effacer
                  </button>
                )}
              </label>
              <label className="md:col-span-3 flex items-center gap-3 bg-[#FFFEFC] border border-[#2E1B20]/15 px-4 py-4">
                <SlidersHorizontal size={17} className="text-[#B85C38] shrink-0" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full bg-transparent outline-none text-sm text-[#514943]">
                  <option value="recent">Plus récents</option>
                  <option value="oldest">Plus anciens</option>
                  <option value="title">Ordre alphabétique</option>
                </select>
              </label>
              <div className="md:col-span-2 flex items-center justify-center bg-[#2E1B20] px-4 py-4 text-[#F9F8F6] text-xs font-bold uppercase tracking-[0.14em]">
                {loading ? 'Chargement…' : `${items.length} contenu${items.length === 1 ? '' : 's'}`}
              </div>
            </div>

            {/* Catégories */}
            <div className="mt-5 flex flex-wrap gap-2">
              {RESOURCE_LIBRARY_CATEGORIES.map((category) => {
                const active = activeCategory === category.value;
                return (
                  <button 
                    key={category.value} 
                    type="button" 
                    onClick={() => setActiveCategory(category.value)} 
                    aria-pressed={active} 
                    className={`px-4 py-2.5 border text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.13em] transition-colors ${
                      active ? 'bg-[#B85C38] border-[#B85C38] text-white' : 'bg-transparent border-[#2E1B20]/20 text-[#64544A] hover:border-[#B85C38] hover:text-[#8B442A]'
                    }`}
                  >
                    {category.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* === LISTE DES CONTENUS === */}
        <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-12 md:py-16">
          {warnings.length > 0 && (
            <div className="mb-5 border border-[#D4A84B]/50 bg-[#F7EEDB] px-4 py-3 text-sm text-[#6B5235]">
              {warnings.join(' ')}
            </div>
          )}

          {loading ? (
            <LoadingState variant="spinner" message="Ouverture des archives…" />
          ) : error ? (
            <ErrorMessage
              type={error.type || 'generic'}
              title="Bibliothèque indisponible"
              message={error.message}
              onRetry={resetFilters}
            />
          ) : items.length === 0 ? (
            <EmptyState
              title="Aucune ressource ne correspond à la recherche."
              description="Essaie un autre mot-clé ou réinitialise les filtres pour explorer toute la bibliothèque."
              onReset={resetFilters}
            />
          ) : (
            <>
              {/* Article en vedette */}
              {featured && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 md:mb-24">
                  <div className="relative lg:col-span-7 group overflow-hidden bg-[#E4D8C8]">
                    <Link to={`/resources/${featured.slug}`} aria-label={`Lire : ${featured.title}`} className="block relative">
                      <ArticleCover item={featured} className="aspect-[4/3] md:aspect-[16/10] w-full object-cover transition-transform duration-1000 group-hover:scale-[1.035]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/5" />
                      <span className="absolute left-5 top-5 bg-[#F9F8F6] px-3 py-2 text-[9px] uppercase tracking-[0.18em] font-bold text-[#7C432B]">
                        À la une
                      </span>
                      <span className="absolute bottom-5 right-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#D4A84B] text-[#211B18]">
                        <ArrowUpRight size={19} />
                      </span>
                    </Link>
                    {featured.slug === 'le-siwak-sothiou-histoire-et-usages' && (
                      <p className="bg-[#F0E8DD] px-3 py-2 text-[10px] leading-5 text-[#695A4E]">
                        Photo : Kriplozoik / Wikimedia Commons · CC BY-SA 3.0 · <a className="underline" href="https://commons.wikimedia.org/wiki/File:Miswak.jpg" target="_blank" rel="noreferrer">Crédit et licence</a>
                      </p>
                    )}
                  </div>
                  <div className="lg:col-span-5">
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#8A6B59]">
                      <span>{getCategoryLabel(featured.category)}</span>
                      <span className="h-px w-7 bg-[#B85C38]" />
                      <span>{formatPublicationDate(featured.publishedAt)}</span>
                    </div>
                    <Link to={`/resources/${featured.slug}`} className="block mt-5 font-serif text-4xl sm:text-5xl lg:text-6xl leading-[0.98] tracking-tight text-[#211B18] hover:text-[#8B442A] transition-colors">
                      {featured.title}
                    </Link>
                    <p className="mt-5 text-sm md:text-base leading-7 text-[#766960]">
                      {featured.excerpt || 'Une lecture pour découvrir de nouvelles histoires et perspectives.'}
                    </p>
                    <div className="mt-7 flex items-center gap-3 text-[10px] uppercase font-bold tracking-[0.15em] text-[#817165]">
                      <Clock3 size={14} /> {featured.kind === 'article' ? `${estimateReadingTime(featured.content)} min de lecture` : 'Ressource sélectionnée'}
                    </div>
                    <Link to={`/resources/${featured.slug}`} className="mt-8 inline-flex items-center gap-3 border-b border-[#2E1B20] pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#2E1B20] hover:text-[#B85C38] hover:border-[#B85C38] transition-colors">
                      Lire cette histoire <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Grille du reste */}
              {rest.length > 0 && (
                <div>
                  <div className="flex items-end justify-between gap-5 border-b border-black/15 pb-5 mb-7">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[#8A6B59] font-bold">Le fonds éditorial</p>
                      <h2 className="mt-2 font-serif text-3xl md:text-4xl text-[#211B18]">À explorer</h2>
                    </div>
                    <p className="text-xs text-[#8A7A6D]">{rest.length} autre{rest.length === 1 ? '' : 's'} contenu{rest.length === 1 ? '' : 's'}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-7">
                    {rest.map((item) => <ResourceCard key={item.id} item={item} onOpen={openItem} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}