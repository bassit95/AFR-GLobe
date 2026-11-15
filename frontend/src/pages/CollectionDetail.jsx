// src/pages/CollectionDetail.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, X } from 'lucide-react'; // 🎯 Ajout de l'icône X
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import useCollection from '@/hooks/useCollection';
import { imageUrl } from '@/utils/image'; // 🎯 Pour l'image plein écran

export default function CollectionDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: collection, loading, error, refetch } = useCollection(slug);

  // 🎯 État pour gérer l'image sélectionnée dans la Lightbox
  const [selectedImage, setSelectedImage] = useState(null);

  // 🎯 Fermer la lightbox avec la touche "Escape"
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <LoadingState message="Chargement de la collection…" />
      </main>
    );
  }

  if (error || !collection) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6">
        <ErrorMessage
          type={error?.type || 'notFound'}
          title="Collection indisponible"
          message={error?.message || "Cette collection n'existe pas."}
          onRetry={error ? refetch : () => navigate('/collections')}
        />
      </main>
    );
  }

  return (
    <main className="bg-[#F9F8F6] text-[#1A1A1A] min-h-screen relative">
      {/* HERO */}
      <section className="relative h-[60vh] bg-[#1A0F12] text-white overflow-hidden">
        <ImageWithFallback
          src={collection.cover_image}
          alt={collection.name}
          nameForFallback={collection.name}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-12 md:pb-20">
          <Link
            to="/collections"
            className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors mb-6 w-fit"
          >
            <ArrowLeft size={14} className="mr-2" /> Archives
          </Link>
          
          {collection.brand && (
            <Link
              to={`/marques/${collection.brand.slug}`}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A84B] hover:text-white mb-3"
            >
              {collection.brand.name} ↗
            </Link>
          )}
          
          <h1 className="text-5xl md:text-7xl font-['Playfair_Display'] leading-none mb-4">
            {collection.name}
          </h1>
          
          <p className="text-sm md:text-base text-white/80 max-w-2xl">
            {collection.season} {collection.year} — {collection.description}
          </p>
        </div>
      </section>

      {/* PRODUITS & LOOKS */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-24">
        
        {/* Produits */}
        {collection.products?.length > 0 && (
          <div className="mb-20">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B85C38] mb-6">
              Les pièces de la collection
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {collection.products.map(product => (
                <Link 
                  key={product.id} 
                  to={`/produits/${product.slug}`}
                  className="group border border-black/10 bg-white p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-['Playfair_Display'] text-lg group-hover:text-[#B85C38] transition-colors mb-2">
                    {product.name}
                  </h3>
                  <span className="text-[10px] uppercase tracking-widest flex items-center justify-between text-gray-500">
                    Voir le produit <ArrowUpRight size={13} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 🎯 LOOKS (Avec fonctionnalité Lightbox) */}
        {collection.portfolio_items?.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B85C38] mb-6">
              Les looks
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {collection.portfolio_items.map(item => (
                <div 
                  key={item.id} 
                  // 🎯 On ajoute un onClick et un curseur pointer
                  onClick={() => setSelectedImage(item)}
                  className="relative aspect-[3/4] group overflow-hidden bg-gray-200 border border-black/10 cursor-pointer"
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    nameForFallback={collection.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="font-['Playfair_Display'] text-lg">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* =========================================
          🎯 LIGHTBOX (MODALE PLEIN ÉCRAN)
      ========================================= */}
      {selectedImage && (
        <div 
          // 🎯 Overlay avec fond noir semi-transparent et flou
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-12 transition-opacity duration-300 animate-in fade-in"
          onClick={() => setSelectedImage(null)} // Ferme en cliquant à l'extérieur
        >
          {/* Bouton Fermer (Croix en haut à droite) */}
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] p-2 bg-white/10 rounded-full text-white hover:bg-white hover:text-black transition-colors"
          >
            <X size={24} />
          </button>

          {/* Image container (stopPropagation pour ne pas fermer en cliquant sur l'image) */}
          <div 
            className="relative max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              // 🎯 On utilise imageUrl pour gérer l'URL, et object-contain pour ne pas déformer
              src={imageUrl(selectedImage.image)}
              alt={selectedImage.title}
              className="max-h-[75vh] w-auto object-contain shadow-2xl rounded-sm animate-in zoom-in-95 duration-300"
            />
            
            {/* Titre et description sous l'image */}
            <div className="mt-6 text-center text-white">
              <h3 className="text-2xl font-['Playfair_Display']">
                {selectedImage.title}
              </h3>
              {selectedImage.description && (
                <p className="text-sm text-gray-300 mt-2 max-w-lg">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}