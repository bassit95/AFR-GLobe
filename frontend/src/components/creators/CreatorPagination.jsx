// src/components/creators/CreatorPagination.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CreatorPagination({ safePage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  // On limite l'affichage pour ne pas avoir 50 numéros
  const visiblePages = pages.filter(p => {
    if (totalPages <= 5) return true;
    if (p === 1 || p === totalPages) return true;
    return Math.abs(p - safePage) <= 1;
  });

  return (
    <div className="flex justify-end items-center mt-16 mb-8 gap-6 pr-6">
      
      {/* Bouton Précédent */}
      <button
        onClick={() => onPageChange(safePage - 1)}
        disabled={safePage === 1}
        className="flex items-center justify-center w-10 h-10 border border-[#2E1B20]/20 rounded-full text-[#2E1B20] hover:bg-[#2E1B20] hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={18} />
      </button>

      {/* 🎯 Le Cadran des numéros */}
      <div className="flex items-center gap-2">
        {visiblePages.map((page, index) => {
          const isActive = page === safePage;
          const showEllipsis = index > 0 && page - visiblePages[index - 1] > 1;

          return (
            <div key={page} className="flex items-center gap-2">
              {showEllipsis && <span className="text-gray-400">...</span>}
              
              <button
                onClick={() => onPageChange(page)}
                className={`relative flex items-center justify-center w-12 h-12 transition-all duration-300 ${
                  isActive
                    ? 'text-4xl font-black font-[\'Playfair_Display\'] text-[#B85C38] scale-110'
                    : 'text-sm font-bold text-[#2E1B20]/40 hover:text-[#2E1B20]'
                }`}
              >
                {/* Cercle décoratif derrière le numéro actif */}
                {isActive && (
                  <span className="absolute inset-0 border-2 border-[#B85C38] rounded-full opacity-30 animate-[spin_10s_linear_infinite]" />
                )}
                {String(page).padStart(2, '0')}
              </button>
            </div>
          );
        })}
      </div>

      {/* Bouton Suivant */}
      <button
        onClick={() => onPageChange(safePage + 1)}
        disabled={safePage === totalPages}
        className="flex items-center justify-center w-10 h-10 border border-[#2E1B20]/20 rounded-full text-[#2E1B20] hover:bg-[#2E1B20] hover:text-white transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}