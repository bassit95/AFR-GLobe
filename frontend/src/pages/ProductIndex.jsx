// src/pages/ProductIndex.jsx
import { Link } from 'react-router-dom';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import PageBanner from '@/components/Cards/PageBanner';
import EditorialLabel from '@/components/ui/EditorialLabel';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';
import useProducts from '@/hooks/useProducts';
import { formatPrice } from '@/utils/formatters';

const bannerImage = '/images/banner/banner-02.jpeg'; // Ajuste si besoin

export default function ProductIndex() {
  const { data: products, loading, error, meta, setPage, resetFilters } = useProducts();

  const page = meta?.current_page || 1;
  const lastPage = meta?.last_page || 1;

  

  return (
    <>
      <PageBanner
        title="Boutique."
        currentPage="Produits"
        imageUrl={bannerImage}
        subtitle="Découvrez les pièces et créations des maisons africaines."
      />

      <main className="min-h-screen bg-[#F9F8F6] text-[#1A1A1A]">
        <section className="max-w-[1440px] mx-auto px-5 md:px-10 py-12 md:py-16">
          <div className="mb-10 border-b border-black/15 pb-5">
            <EditorialLabel prefix="N°05" text="Le vestiaire" />
            <h2 className="font-['Playfair_Display'] text-3xl md:text-4xl italic">
              Les pièces à découvrir
            </h2>
          </div>

          {loading && <LoadingState variant="skeleton" count={6} />}

          {!loading && error && (
            <ErrorMessage type={error.type} message={error.message} onRetry={resetFilters} />
          )}

          {!loading && !error && products.length === 0 && (
            <EmptyState
              title="Aucun produit disponible."
              description="Le catalogue est en cours de mise à jour."
              onReset={resetFilters}
            />
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/produits/${product.slug}`}
                    className="group flex flex-col"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#EFE8DC] border border-black/5">
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        nameForFallback={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      {product.availability === 'sold_out' && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[9px] font-bold uppercase px-2 py-1">
                          Épuisé
                        </span>
                      )}
                    </div>
                    <div className="pt-4 flex flex-col flex-1">
                      {product.brand && (
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#9A6142] mb-1">
                          {product.brand.name}
                        </span>
                      )}
                      <h3 className="font-['Playfair_Display'] text-xl leading-tight group-hover:italic transition-all">
                        {product.name}
                      </h3>
                      <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-2">
                        <span className="text-sm font-medium">
                          {formatPrice(product.price, product.currency)}
                        </span>
                        <ArrowUpRight size={16} className="text-[#B85C38]" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {lastPage > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="border border-black/20 px-5 py-3 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30"
                  >
                    Précédent
                  </button>
                  <span className="text-xs text-gray-500">Page {page} / {lastPage}</span>
                  <button
                    disabled={page >= lastPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="border border-black/20 px-5 py-3 text-[10px] font-bold uppercase tracking-widest disabled:opacity-30"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}