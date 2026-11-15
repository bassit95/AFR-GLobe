import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shirt, ShoppingBag, Scissors, 
  Footprints, Gem, Briefcase, Glasses, Baby, Layers, User, Globe 
} from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function CreatorCard({ creator }) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  const [isHovered, setIsHovered] = useState(false);

  if (!creator) return null;

  // 🎯 ON PREND TOUT DU BACKEND (Zéro donnée inventée côté front)
  const countryCode = creator.country_of_origin?.code || '';
  const countryName = creator.country_of_origin?.name || 'Afrique';
  
  // Formatage de la catégorie principale (envoyée par le backend)
  const firstCategory = Array.isArray(creator.categories) ? creator.categories[0] : null;
  const rawCategoryName = typeof firstCategory === 'string' 
    ? firstCategory 
    : (firstCategory?.name || firstCategory?.slug || 'Créateur');
  const categoryFormatted = rawCategoryName.replace(/-/g, ' ').toUpperCase();

  // 🎯 FONCTION POUR LES ICÔNES DYNAMIQUES
  const renderCategoryIcon = (slug) => {
    switch (slug?.toLowerCase()) {
      case 'womenswear': return <User size={14} strokeWidth={1.5} title="Womenswear" />;
      case 'menswear': return <Shirt size={14} strokeWidth={1.5} title="Menswear" />;
      case 'shoes': return <Footprints size={14} strokeWidth={1.5} title="Shoes" />;
      case 'jewelry': return <Gem size={14} strokeWidth={1.5} title="Jewelry" />;
      case 'bags': return <Briefcase size={14} strokeWidth={1.5} title="Bags" />;
      case 'accessories': return <Glasses size={14} strokeWidth={1.5} title="Accessories" />;
      case 'children': return <Baby size={14} strokeWidth={1.5} title="Children" />;
      case 'textile': return <Layers size={14} strokeWidth={1.5} title="Textile" />;
      case 'ready-to-wear': return <ShoppingBag size={14} strokeWidth={1.5} title="Ready-to-Wear" />;
      default: return <Scissors size={14} strokeWidth={1.5} title="Fashion" />;
    }
  };

  // Effet 3D de survol (Tilt)
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`
    );
  };

  return (
    <Link
      to={`/creators/${creator.slug || creator.id}`}
      className="group block relative focus:outline-none"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
      }}
    >
      <div
        ref={cardRef}
        className="relative bg-transparent transition-transform duration-300 ease-out transform-gpu preserve-3d"
        style={{ transform: transformStyle }}
      >
        {/* TEXTE PAYS 3D FLOTTANT */}
        <div
          className={`pointer-events-none absolute -top-8 -left-4 z-0 font-serif text-5xl sm:text-6xl font-bold uppercase tracking-widest text-[#B85C38]/20 transition-all duration-700 ease-out select-none ${
            isHovered ? 'opacity-100 -translate-y-4 translate-z-20 scale-105' : 'opacity-0 translate-y-2 translate-z-0'
          }`}
        >
          {countryName}
        </div>

        {/* PHOTO */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#EFE8DC] z-10 shadow-sm group-hover:shadow-2xl transition-shadow duration-500">
          <ImageWithFallback
            src={creator.profile_image}
            alt={creator.name}
            nameForFallback={creator.name}
            className="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {creator.verification_status === 'verified' && (
            <span className="absolute top-3 right-3 z-20 bg-black/75 backdrop-blur-md text-white text-[9px] tracking-widest uppercase px-2.5 py-1">
              Certifié
            </span>
          )}
        </div>

        {/* INFORMATIONS */}
        <div className="pt-3 pb-2 z-10 relative">
          <div className="flex items-center space-x-2 text-[10px] tracking-[0.25em] font-medium text-[#1A1A1A] uppercase pt-1 pb-1.5 border-b border-[#EFE8DC]">
            {/* 🎯 GESTION DU DRAPEAU : Uniquement si le backend fournit le code */}
            {countryCode ? (
              <img 
                src={`https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`} 
                alt={`Drapeau ${countryName}`} 
                className="w-3.5 h-2.5 object-cover border border-gray-200" 
              />
            ) : (
              <Globe size={12} className="text-gray-400" />
            )}
            <span>{countryName}</span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-normal tracking-wider text-[#1A1A1A] group-hover:text-[#B85C38] transition-colors duration-300 uppercase mt-2 mb-1">
            {creator.name}
          </h3>

          {/* 🎯 ICÔNES DYNAMIQUES */}
          <div className="flex items-center space-x-2.5 text-[#6B6B6B] my-1.5 h-4">
            {creator.categories && creator.categories.length > 0 ? (
              creator.categories.slice(0, 4).map((cat, idx) => (
                <span key={idx}>{renderCategoryIcon(cat.slug || cat.name)}</span>
              ))
            ) : (
              <Shirt size={14} strokeWidth={1.5} />
            )}
          </div>

          <div className="text-xs font-light italic text-[#6B6B6B]">
            {categoryFormatted}
          </div>
        </div>
      </div>
    </Link>
  );
}
