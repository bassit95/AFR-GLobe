import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, ShoppingBag, Footprints, Gem, Scissors, User, Globe } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';

export default function CreatorCard({ creator, index }) {
  if (!creator) return null;

  const countryCode = creator.country_of_origin?.code || '';
  const countryName = creator.country_of_origin?.name || 'Afrique';
  
  // Palette de couleurs Y2K / Streetwear pour les fonds des cartes
  const bgColors = ['bg-[#FF0000]', 'bg-[#FFD700]', 'bg-[#00FF00]', 'bg-[#FF69B4]', 'bg-[#0000FF]'];
  const cardColor = bgColors[index % bgColors.length];
  
  // Rotation aléatoire pour l'effet "collé à la va-vite"
  const rotations = ['rotate-1', '-rotate-2', 'rotate-2', '-rotate-1', 'rotate-3'];
  const cardRotation = rotations[index % rotations.length];

  // On récupère la catégorie principale
  const firstCategory = Array.isArray(creator.categories) ? creator.categories[0] : null;
  const rawCategoryName = typeof firstCategory === 'string' ? firstCategory : (firstCategory?.name || firstCategory?.slug || 'Créateur');

  return (
    <Link 
      to={`/creators/${creator.slug}`} 
      className={`group block relative ${cardRotation} hover:rotate-0 transition-transform duration-300 z-10 hover:z-50`}
    >
      {/* Conteneur de la carte avec bordure noire épaisse */}
      <div className="bg-white border-2 border-black p-2 shadow-brutal group-hover:shadow-brutal-red transition-all duration-300">
        
        {/* Image avec fond coloré et effet N&B */}
        <div className={`relative aspect-[4/5] w-full overflow-hidden ${cardColor} border-2 border-black`}>
          
          <ImageWithFallback
            src={creator.profile_image || creator.cover_image}
            alt={creator.name}
            nameForFallback={creator.name}
            // Effet photocopie : N&B très contrasté qui reprend ses couleurs au survol
            className="w-full h-full object-cover grayscale contrast-150 mix-blend-multiply group-hover:grayscale-0 group-hover:contrast-100 group-hover:mix-blend-normal transition-all duration-500 scale-105 group-hover:scale-100"
          />

          {/* Badge Pays (Style Sticker) */}
          <div className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 transform rotate-12 border border-white">
            {countryCode || 'AFR'}
          </div>
        </div>

        {/* Texte en dessous (Style Flyer) */}
        <div className="pt-4 pb-2 px-1 relative">
          
          {/* Nom Géant */}
          <h3 className="text-2xl md:text-3xl font-['Anton'] text-black uppercase leading-[0.85] tracking-tighter mb-2 break-words">
            {creator.name}
          </h3>

          {/* Ligne de démarcation brute */}
          <div className="w-full h-1 bg-black mb-2"></div>

          {/* Infos (Catégorie + Pays) */}
          <div className="flex justify-between items-end">
            <p className="text-[10px] font-bold uppercase tracking-widest text-black max-w-[60%]">
              {rawCategoryName}
            </p>
            
            <div className="flex space-x-1">
              <Shirt size={14} className="text-black" />
              <Scissors size={14} className="text-black" />
            </div>
          </div>
          
        </div>
      </div>
    </Link>
  );
}

