// src/pages/CollectionIndex.jsx
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar } from 'lucide-react';
import PageBanner from '@/components/Cards/PageBanner';
import EditorialLabel from '@/components/ui/EditorialLabel';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import useCollections from '@/hooks/useCollections';

const bannerImage = '/images/banner/banner-02.jpeg';

export default function CollectionIndex() {
  const { data: collections, loading, error, meta, setPage, resetFilters } = useCollections();

  const page = meta?.current_page || 1;
  const lastPage = meta?.last_page || 1;

  return (
    <>
      <PageBanner
        title="Collections."
        currentPage="Collections"
        imageUrl={bannerImage}
        subtitle="Les archives saisonnières des maisons africaines."
      />

      <main className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A]">
        <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="mb-10 border-b border-black/15 pb-5">
            <EditorialLabel prefix="N°06" text="Les archives" />
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl italic">
              Le fonds de collections
            </h2>
          </div>

          {loading && <LoadingState variant="skeleton" count={6} />}

          {!loading && error && (
            <ErrorMessage
              type={error.type}
              message={error.message}
              onRetry={resetFilters}
            />
          )}

          {/* ✅ Résultats */}
          {!loading && !error && collections.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collections/${collection.slug}`}
                  className="group flex flex-col border border-black/10 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] bg-[#EFE8DC] overflow-hidden">
                    <ImageWithFallback
                      src={collection.cover_image}
                      alt={collection.name}
                      nameForFallback={collection.name}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    {collection.brand && (
                      <span className="text-[9px] font-bold uppercase tracking-widest text-[#9A6142] mb-2 block">
                        {collection.brand.name}
                      </span>
                    )}
                    <h3 className="font-['Playfair_Display'] text-2xl group-hover:italic transition-all">
                      {collection.name}
                    </h3>
                    <p className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                      <Calendar size={13} /> {collection.season} {collection.year}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ✅ FIX B2 — Pagination HORS du collections.length > 0 */}
          {!loading && !error && lastPage > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage(Math.max(1, page - 1))}
                className="border border-black/20 px-5 py-3 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30"
              >
                Précédent
              </button>
              <span className="text-xs text-gray-500">
                Page {page} / {lastPage}
              </span>
              <button
                disabled={page >= lastPage}
                onClick={() => setPage(page + 1)}
                className="border border-black/20 px-5 py-3 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30"
              >
                Suivant
              </button>
            </div>
          )}

          {/* ✅ État vide */}
          {!loading && !error && collections.length === 0 && (
            <EmptyState
              title="Aucune collection disponible."
              description="Les archives sont en cours de numérisation."
              onReset={resetFilters}
            />
          )}
        </section>
      </main>
    </>
  );
}