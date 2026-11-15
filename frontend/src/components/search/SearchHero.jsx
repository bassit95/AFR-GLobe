// src/components/search/SearchHero.jsx
import SearchBar from './SearchBar';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import AfricanMotif from '@/components/ui/AfricanMotif';

const SUGGESTIONS = [
  'Thebe Magugu', 'Côte d\'Ivoire', 'Haute Couture', 'Textiles', 'Dakar', 'LVMH Prize'
];

export default function SearchHero({ bannerImage = '/images/banner/banner-02.jpeg', initialQuery = '' }) {
  return (
    <section className="relative w-full min-h-[65vh] flex flex-col items-center justify-end overflow-hidden bg-[#1A0F12] px-4 pb-20 pt-32">
      
      {/* Image de fond (Bannière) */}
      <ImageWithFallback
        src={bannerImage}
        alt="Africa Global Creative Index"
        className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale"
      />
      
      {/* Overlay sombre */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#F9F8F6]" />

      {/* Motif Africain (Décor) */}
      <AfricanMotif className="absolute left-10 top-20 h-64 w-12 opacity-20 hidden md:block" color="#D4A84B" />
      <AfricanMotif className="absolute right-10 bottom-20 h-64 w-12 opacity-20 hidden md:block rotate-180" color="#B85C38" />

      {/* Contenu */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4A84B] mb-4">
          Africa Global / Search
        </span>
        
        <h1 className="impact text-6xl md:text-8xl uppercase tracking-tighter text-white mb-12 leading-none">
          Creative Index.
        </h1>

        {/* La barre de recherche personnalisée */}
        <SearchBar initialQuery={initialQuery} />

        {/* Suggestions (Tags NON CLIQUABLES) */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-3">
          <span className="text-xs text-white/50 uppercase tracking-widest font-bold mr-2">Suggestions :</span>
          {SUGGESTIONS.map((tag) => (
            <span
              key={tag}
              className="px-4 py-1.5 rounded-full border border-white/20 text-xs text-white/80 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}