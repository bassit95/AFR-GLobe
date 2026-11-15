import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import ImageWithFallback from "../ui/ImageWithFallback";
import AfricanMotif from "../ui/AfricanMotif";


export default function CategoryCard({ to, num, title, desc, tag, image, color }) {
  return (
    <Link to={to} className="group block">
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-200">
        <ImageWithFallback
          src={image}
          alt={title}
          nameForFallback={title}
          className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />

        {/* Numéro */}
        <span className="absolute top-3 left-4 impact text-[5rem] md:text-[6rem] leading-none text-white/40 select-none pointer-events-none">
          {num}
        </span>

        {/* Flèche */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/40 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-all group-hover:bg-[#D4A84B] group-hover:border-[#D4A84B]">
          <ArrowUpRight size={16} strokeWidth={1.8} className="text-white group-hover:text-[#2E1B20] transition-colors" />
        </div>

        {/* Tag */}
        <div className="absolute bottom-4 left-4">
          <span className="inline-block text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 text-white" style={{ backgroundColor: color }}>
            {tag}
          </span>
        </div>

        {/* Ligne dorée au survol */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D4A84B] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl text-black group-hover:italic transition-all">
            {title}
          </h3>
          <p className="mt-2 text-xs md:text-sm text-gray-500 leading-relaxed max-w-xs">
            {desc}
          </p>
        </div>

        <AfricanMotif className="shrink-0 h-14 w-4 opacity-30 mt-2 transition-opacity group-hover:opacity-100" color={color} />
      </div>
    </Link>
  );
}