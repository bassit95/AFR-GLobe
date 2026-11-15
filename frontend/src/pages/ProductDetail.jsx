// src/pages/ProductDetail.jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ExternalLink, ShoppingBag } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import useProduct from '@/hooks/useProduct';
import { formatPrice } from '@/utils/formatters';
import { safeExternalUrl } from '@/utils/immersionHelpers';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: product, loading, error, refetch } = useProduct(slug);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <LoadingState message="Chargement du produit…" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6">
        <ErrorMessage
          type={error?.type || 'notFound'}
          title="Produit indisponible"
          message={error?.message || "Ce produit n'existe pas."}
          onRetry={error ? refetch : () => navigate('/produits')}
        />
      </main>
    );
  }

  const shopUrl = safeExternalUrl(product.product_url);

  return (
    <main className="bg-[#F9F8F6] text-[#1A1A1A] min-h-screen">
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <Link
          to="/produits"
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F6259] hover:text-[#B85C38] transition-colors mb-10"
        >
          <ArrowLeft size={14} className="mr-2" /> Catalogue
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-[#EFE8DC] border border-black/10">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              nameForFallback={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Infos */}
          <div className="flex flex-col justify-center">
            {product.brand && (
              <Link
                to={`/marques/${product.brand.slug}`}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A6142] hover:text-[#B85C38] mb-3"
              >
                {product.brand.name} ↗
              </Link>
            )}
            
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] leading-tight mb-4">
              {product.name}
            </h1>

            <p className="text-2xl font-medium mb-6">
              {formatPrice(product.price, product.currency)}
            </p>

            {product.description && (
              <p className="text-sm md:text-base text-gray-600 leading-relaxed text-justify mb-8 border-t border-black/10 pt-6">
                {product.description}
              </p>
            )}

            <div className="space-y-4 mb-8">
              {product.collection && (
                <p className="text-xs text-gray-500">
                  <span className="font-bold uppercase tracking-widest mr-2">Collection:</span>
                  {product.collection.name} ({product.collection.season} {product.collection.year})
                </p>
              )}
              {product.categories?.length > 0 && (
                <p className="text-xs text-gray-500">
                  <span className="font-bold uppercase tracking-widest mr-2">Catégories:</span>
                  {product.categories.map(c => c.name).join(', ')}
                </p>
              )}
            </div>

            {shopUrl ? (
              <a
                href={shopUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-[#2E1B20] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white hover:bg-[#B85C38] transition-colors"
              >
                Acheter sur le site officiel <ExternalLink size={14} />
              </a>
            ) : (
              <p className="text-[10px] uppercase tracking-widest text-gray-400 border border-gray-300 p-4 text-center">
                Lien d'achat non disponible
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}