// src/components/ui/Marquee.jsx
import React from 'react';

function Marquee({ 
  items = [], 
  className = '', 
  bgColor = '#2E1B20', // 🎯 Couleur de fond par défaut (bordeaux)
  textColor = '#FFFFFF', // 🎯 Couleur du texte par défaut (blanc)
  accentColor = '#D4A84B' // 🎯 Couleur des étoiles et des rayures (doré)
}) {
  const row = [...items, ...items, ...items]; // Duplique pour l'effet infini

  return (
    <div 
      className={`w-full overflow-hidden flex items-center h-16 relative ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      {/* Rayures décoratives sur les côtés (visibles sur grand écran) */}
      <div 
        className="absolute left-0 w-32 h-full opacity-25 z-10 hidden md:block" 
        style={{ backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 10px, ${accentColor} 10px, ${accentColor} 20px)` }}
      />
      <div 
        className="absolute right-0 w-32 h-full opacity-25 z-10 hidden md:block" 
        style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${accentColor} 10px, ${accentColor} 20px)` }}
      />
      
      {/* Le texte qui défile */}
      <div className="animate-marquee whitespace-nowrap text-xl md:text-3xl font-black uppercase tracking-widest flex items-center gap-4">
        {row.map((item, i) => (
          <span key={`${item}-${Math.floor(i / items.length)}`} className="flex items-center gap-4">
            {item} <span style={{ color: accentColor }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default Marquee;