import React from 'react';
import AfricanMotif from '../ui/AfricanMotif';
import EditorialLabel from '../ui/EditorialLabel';

// 🎯 Le composant Folio est déplacé ici car il est spécifique à cette mise en page
function Folio({ number, label = 'Africa Global · Édition éditoriale' }) {
  return (
    <div className="mt-8 flex items-center justify-between border-t border-black/20 pt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-black/55">
      <span>{number} / 04</span>
      <span>{label}</span>
      <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full border border-black/25 text-sm">
        ✳
      </span>
    </div>
  );
}

export default function EditorialSpread({ 
  leftImage, 
  leftImageAlt = "Image de gauche",
  leftLabel, 
  leftTitle, 
  leftText, 
  leftFolioNumber,
  rightImage, 
  rightImageAlt = "Image de droite",
  rightLabel, 
  rightTitle, 
  rightText, 
  rightFolioNumber 
}) {
  return (
    <section className="relative mx-auto w-full max-w-[1500px] px-4 py-8 md:px-8 md:py-14">
      
      {/* Motif de fond gauche */}
      <AfricanMotif className="pointer-events-none absolute left-0 top-20 hidden h-56 w-8 opacity-70 md:block" />

      <div className="relative grid grid-cols-1 bg-[#F7F3EA] md:grid-cols-2">
        
        {/* --- PAGE DE GAUCHE --- */}
        <article className="relative flex flex-col border-b border-black/20 p-6 sm:p-9 md:border-b-0 md:border-r md:p-12 lg:p-16">
          <div className="group relative mb-7 overflow-hidden border border-black/10 bg-[#D8C7B4]">
            <img
              src={leftImage}
              alt={leftImageAlt}
              className="aspect-[4/3] w-full object-cover grayscale-[15%] transition-transform duration-700 group-hover:scale-[1.03] sm:aspect-[5/4]"
              loading="eager"
            />
            <AfricanMotif className="absolute right-3 top-3 h-24 w-8 opacity-90" color="#F4F1EA" />
          </div>

          <EditorialLabel text={leftLabel} />
          
          <h1 className="mb-6 max-w-xl impact text-5xl uppercase leading-[0.88] tracking-tight sm:text-6xl lg:text-7xl">
            {leftTitle}
          </h1>
          
          <div className="max-w-xl text-sm leading-7 text-black/75 sm:text-base sm:leading-8">
            {leftText}
          </div>
          
          <Folio number={leftFolioNumber} />
        </article>

        {/* --- PAGE DE DROITE --- */}
        <article className="relative flex flex-col p-6 sm:p-9 md:p-12 lg:p-16 mt-5 md:mt-0">
          <div className="group relative mb-7 overflow-hidden border border-black/10 bg-[#642B75]">
            <img
              src={rightImage}
              alt={rightImageAlt}
              className="aspect-[4/3] w-full object-cover mix-blend-luminosity opacity-95 transition-transform duration-700 group-hover:scale-[1.03] sm:aspect-[5/4]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[#642B75]/15 mix-blend-multiply" />
            <AfricanMotif className="absolute left-3 top-3 h-24 w-8" color="#F4F1EA" />
          </div>

          <EditorialLabel text={rightLabel} />

          <h2 className="mb-6 impact text-4xl uppercase leading-[0.9] tracking-tight sm:text-5xl lg:text-6xl">
            {rightTitle}
          </h2>
          
          <div className="space-y-4 text-sm leading-7 text-black/75 sm:text-base sm:leading-8">
            {rightText}
          </div>
          
          <Folio number={rightFolioNumber} />
        </article>
      </div>

      {/* Motif de fond droit */}
      <AfricanMotif className="pointer-events-none absolute bottom-0 right-2 hidden h-36 w-10 opacity-70 md:block" color="#642B75" />
    </section>
  );
}