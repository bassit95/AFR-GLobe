// src/components/sections/SectionIndex.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import MainBtn from '../ui/button/MainBtn';

const indexImages = [
  '/images/index/index-01.jpeg',
  '/images/index/index-02.jpeg',
  '/images/index/index-03.jpeg',
  '/images/index/index-04.jpeg',
  '/images/index/index-05.jpeg',
];

function SectionIndex() {
  return (
    <Link
      to="/creators"
      // ✅ Fix : espace entre md:py-32 et overflow-hidden
      className="group relative block w-full h-[60vh] md:h-[70vh] py-20 md:py-32 overflow-hidden bg-black cursor-pointer"
    >
      <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-5 h-full w-full">
        {indexImages.map((img, i) => (
          <div key={i} className={`relative h-full w-full overflow-hidden ${i > 1 ? 'hidden md:block' : 'block'}`}>
            <img
              src={img}
              alt={`Créateur africain ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] text-white/90 mb-4 md:mb-6">
          Ressource Phare
        </span>

        <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-4 md:mb-6">
          Index des Créateurs
        </h2>

        <p className="max-w-2xl text-xs md:text-base text-white/80 font-medium leading-relaxed mb-8 md:mb-10">
          Un répertoire en constante expansion de créateurs et d'ateliers enracinés en Afrique{' '}
          <span className="hidden md:inline">{'— un point de référence pour le paysage créatif du continent.'}</span>
        </p>

        {/*
          ⚠️ MainBtn sans path : le clic remonte au <Link> parent (bubble).
          Vérifier dans le DOM rendu que MainBtn n'est PAS un <Link to={undefined}>.
        */}
        <MainBtn
          text="Explorez l'index"
          className="hover:bg-transparent hover:text-white border border-white"
        />
      </div>
    </Link>
  );
}

export default SectionIndex;