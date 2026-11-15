import { ArrowUpRight, Search, X } from 'lucide-react';
import AfricanMotif from '../ui/AfricanMotif';

export default function CreatorIndexHero({ query, onQueryChange }) {
  const suggestions = ['Nigeria', 'Côte d’Ivoire', 'Haute couture'];

  return (
    <section className="relative overflow-hidden border-b border-black/10 bg-[#F4F1EA]">
      <div className="pointer-events-none absolute -right-8 -top-8 h-44 w-44 rounded-full border border-[#B85C38]/20 sm:h-64 sm:w-64" />
      <div className="relative mx-auto max-w-[1500px] px-4 py-10 sm:px-6 sm:py-14 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-5">
            <div className="mb-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.24em] text-[#7C432B]">
              <span>Archive créative</span><span className="h-px w-8 bg-[#B85C38]" /><span>Afrique & diaspora</span>
            </div>
            <h1 className="font-['Playfair_Display'] text-4xl leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
              Trouvez votre prochain <span className="italic text-[#9C4A2A]">coup de cœur.</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-black/65 sm:text-base sm:leading-7">
              Explorez les créateurs, les signatures et les univers qui font bouger la création africaine.
            </p>
          </div>

          <div className="lg:col-span-7">
            <label htmlFor="creator-search" className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-black/65">Rechercher dans l’index</label>
            <div className="group flex min-h-[60px] items-center border border-black/20 bg-[#F9F8F6] transition-colors focus-within:border-[#9C4A2A]">
              <Search size={21} className="ml-4 shrink-0 text-[#9C4A2A]" />
              <input
                id="creator-search"
                type="search"
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Nom, pays, marque, style…"
                className="h-full min-w-0 flex-1 bg-transparent px-4 py-4 text-sm outline-none placeholder:text-black/35"
              />
              {query && (
                <button type="button" onClick={() => onQueryChange('')} className="mr-2 text-black/50 hover:text-black"><X size={17} /></button>
              )}
              <div className="mr-2 hidden h-10 w-10 items-center justify-center bg-[#2E1B20] text-[#F9F8F6] sm:flex"><ArrowUpRight size={18} /></div>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] uppercase tracking-[0.12em] text-black/45">
              <span className="font-bold text-[#7C432B]">Essayez :</span>
              {suggestions.map((sug) => (
                <button key={sug} type="button" onClick={() => onQueryChange(sug)} className="border-b border-black/20 pb-0.5 hover:border-[#B85C38] hover:text-[#7C432B]">{sug}</button>
              ))}
            </div>
          </div>
        </div>
        <AfricanMotif horizontal className="mt-10 h-7 w-full text-[#B85C38]/60 sm:mt-12 sm:h-9" color="#B85C38" />
      </div>
    </section>
  );
}