// src/pages/BrandIndex.jsx
import { Link } from 'react-router-dom';
import { ArrowUpRight, MapPin } from 'lucide-react';
import PageBanner from '@/components/Cards/PageBanner';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import EditorialLabel from '@/components/ui/EditorialLabel';
import useBrands from '@/hooks/useBrands';

const bannerImage = '/images/banner/banner-02.jpeg';

export default function BrandIndex() {
  const { data: brands, loading, error, meta, setPage, resetFilters } = useBrands();

  const page = meta?.current_page || 1;
  const lastPage = meta?.last_page || 1;

  return (
    <>
      <PageBanner
        title="Marques."
        currentPage="Marques"
        imageUrl={bannerImage}
        subtitle="Les maisons et labels qui font la création africaine contemporaine."
      />

      <main className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A]">
        <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="mb-10 border-b border-black/15 pb-5">
            <EditorialLabel prefix="N°02" text="Répertoire des marques" />
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl italic">
              Les maisons à découvrir
            </h2>
            {!loading && !error && (
              <p className="mt-2 text-xs uppercase font-bold tracking-widest text-gray-500">
                {meta?.total || 0} {meta?.total > 1 ? 'marques' : 'marque'}
              </p>
            )}
          </div>

          {loading && <LoadingState variant="skeleton" count={6} />}

          {!loading && error && (
            <ErrorMessage
              type={error.type || 'generic'}
              message={error.message}
              onRetry={resetFilters}
            />
          )}

          {/* ✅ Résultats */}
          {!loading && !error && brands.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {brands.map((brand) => {
                const location = [brand.city?.name, brand.country?.name]
                  .filter(Boolean)
                  .join(', ');
                return (
                  <Link
                    key={brand.id}
                    to={`/marques/${brand.slug}`}
                    className="group flex flex-col border border-black/10 bg-white transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_#D9C2A3]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EFE8DC]">
                      <ImageWithFallback
                        src={brand.cover_image || brand.logo}
                        alt={brand.name}
                        nameForFallback={brand.name}
                        className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      {brand.founded_year && (
                        <span className="absolute top-4 left-4 bg-[#F9F8F6] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-[#7C432B]">
                          Depuis {brand.founded_year}
                        </span>
                      )}
                      <span className="absolute bottom-3 right-4 font-mono text-xs text-white/85">
                        AG / {String(brand.id).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5 md:p-6">
                      <h3 className="font-['Playfair_Display'] text-2xl leading-tight text-[#21191B] group-hover:text-[#B85C38] transition-colors">
                        {brand.name}
                      </h3>
                      {location && (
                        <p className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                          <MapPin size={13} className="text-[#B85C38]" />
                          <span>{location}</span>
                        </p>
                      )}
                      {brand.description && (
                        <p className="mt-3 flex-1 text-sm leading-6 text-[#766960] line-clamp-3">
                          {brand.description}
                        </p>
                      )}
                      <span className="mt-4 flex items-center justify-between border-t border-black/10 pt-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#2E1B20] group-hover:text-[#B85C38]">
                        Découvrir la maison <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* ✅ FIX B2 — Pagination HORS du brands.length > 0 */}
          {!loading && !error && lastPage > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                type="button"
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
                type="button"
                disabled={page >= lastPage}
                onClick={() => setPage(page + 1)}
                className="border border-black/20 px-5 py-3 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30"
              >
                Suivant
              </button>
            </div>
          )}

          {/* ✅ État vide */}
          {!loading && !error && brands.length === 0 && (
            <EmptyState
              title="Aucune marque à afficher."
              description="Le répertoire des marques est en cours de construction."
              onReset={resetFilters}
            />
          )}
        </section>
      </main>
    </>
  );
}