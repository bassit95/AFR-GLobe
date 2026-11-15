// src/pages/PortfolioDetail.jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import usePortfolioItem from '@/hooks/usePortfolioItem';

export default function PortfolioDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: item, loading, error, refetch } = usePortfolioItem(id);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <LoadingState message="Chargement de la création…" />
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6">
        <ErrorMessage
          type={error?.type || 'notFound'}
          title="Création indisponible"
          message={error?.message || "Cette création n'existe pas."}
          onRetry={error ? refetch : () => navigate(-1)}
        />
      </main>
    );
  }

  return (
    <main className="bg-[#F9F8F6] text-[#1A1A1A] min-h-screen">
      <section className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F6259] hover:text-[#B85C38] transition-colors mb-10"
        >
          <ArrowLeft size={14} className="mr-2" /> Retour
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          {/* Image */}
          <div className="md:col-span-7 relative aspect-[3/4] bg-[#EFE8DC] border border-black/10">
            <ImageWithFallback
              src={item.image}
              alt={item.title}
              nameForFallback={item.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          {/* Infos */}
          <div className="md:col-span-5 md:pt-12">
            {item.creator && (
              <Link
                to={`/creators/${item.creator.slug}`}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A6142] hover:text-[#B85C38] mb-3 inline-block"
              >
                Par {item.creator.name} ↗
              </Link>
            )}
            
            <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] leading-tight mb-4">
              {item.title}
            </h1>

            {item.year && (
              <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">
                Année : {item.year}
              </p>
            )}

            {item.description && (
              <p className="text-base text-gray-700 leading-relaxed text-justify mb-8 border-t border-black/10 pt-6">
                {item.description}
              </p>
            )}

            {item.collection && (
              <div className="bg-white border border-black/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Collection</p>
                <Link to={`/collections/${item.collection.slug}`} className="text-lg font-['Playfair_Display'] hover:text-[#B85C38]">
                  {item.collection.name} ({item.collection.season} {item.collection.year})
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}