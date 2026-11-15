// // src/components/creators/CreatorFilterToolbar.jsx
// import { ArrowDownUp, RotateCcw, SlidersHorizontal } from 'lucide-react';
// import { ALPHABET } from '../../utils/creatorIndex';
// import FilterChip from './FilterChip';

// export default function CreatorFilterToolbar({
//   sortOrder,
//   onSortChange,
//   hasActiveFilters,
//   onReset,
//   selectedLetter,
//   onLetterChange,
//   visibleCategories,
//   selectedCategories,
//   onToggleCategory,
//   showAllCategories,
//   onToggleAllCategories,
// }) {
//   return (
//     <section className="sticky top-0 z-30 border-b border-black/10 bg-[#F9F8F6]/95 shadow-sm backdrop-blur-md">
//       <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 lg:px-10">
//         <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/65">
//             <SlidersHorizontal size={15} className="text-[#9C4A2A]" /> Affiner les résultats
//           </div>

//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:flex-1 xl:justify-end">
//             <label className="flex min-h-11 items-center gap-3 border border-black/15 bg-white px-3 transition-colors focus-within:border-[#B85C38] xl:max-w-[230px]">
//               <ArrowDownUp size={15} className="shrink-0 text-[#9C4A2A]" aria-hidden="true" />
//               <span className="sr-only">Ordre d’affichage</span>
//               <select
//                 value={sortOrder}
//                 onChange={(event) => onSortChange(event.target.value)}
//                 className="w-full min-w-0 bg-transparent py-2.5 text-xs outline-none"
//               >
//                 <option value="az">Nom : A à Z</option>
//                 <option value="za">Nom : Z à A</option>
//                 <option value="recent">Ajouts récents</option>
//               </select>
//             </label>

//             <button
//               type="button"
//               onClick={onReset}
//               disabled={!hasActiveFilters}
//               className="inline-flex min-h-11 items-center justify-center gap-2 border border-black/15 px-4 text-[10px] font-bold uppercase tracking-[0.12em] transition-colors hover:border-[#9C4A2A] hover:text-[#9C4A2A] disabled:cursor-not-allowed disabled:opacity-35 xl:min-w-[145px]"
//             >
//               <RotateCcw size={13} /> Réinitialiser
//             </button>
//           </div>
//         </div>

//         <div className="mt-4 border-t border-black/10 pt-3">
//           <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">
//             Par ordre alphabétique
//           </div>
//           <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
//             {ALPHABET.map((letter) => {
//               const active = selectedLetter === letter;
//               return (
//                 <button
//                   key={letter}
//                   type="button"
//                   aria-pressed={active}
//                   onClick={() => onLetterChange(letter)}
//                   className={`flex h-8 min-w-8 shrink-0 items-center justify-center border px-2 text-[10px] font-bold transition-colors ${
//                     active
//                       ? 'border-[#2E1B20] bg-[#2E1B20] text-white'
//                       : 'border-transparent text-black/55 hover:border-[#B85C38]/40 hover:bg-white hover:text-[#7C432B]'
//                   }`}
//                 >
//                   {letter === 'ALL' ? 'Tous' : letter}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="mt-4 border-t border-black/10 pt-3">
//           <div className="mb-2 flex items-center justify-between gap-3">
//             <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">
//               Univers créatif
//             </div>
//             <button
//               type="button"
//               onClick={onToggleAllCategories}
//               className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7C432B] hover:text-black"
//             >
//               {showAllCategories ? 'Réduire' : 'Toutes les catégories'}
//             </button>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {/* 1.5 — backend renvoie {id, name, slug}, pas {value, label} */}
//             {visibleCategories.map((category) => (
//               <FilterChip
//                 key={category.id}
//                 active={selectedCategories.includes(category.id)}
//                 onClick={() => onToggleCategory(category.id)}
//               >
//                 {category.name}
//               </FilterChip>
//             ))}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// src/components/creators/CreatorFilterToolbar.jsx
import { ArrowDownUp, RotateCcw, SlidersHorizontal, Users, Building2, Shirt, Layers } from 'lucide-react';
import { ALPHABET } from '../../utils/creatorIndex';
import FilterChip from './FilterChip';

export default function CreatorFilterToolbar({
  activeTab, setActiveTab,
  sortOrder, onSortChange, hasActiveFilters, onReset,
  selectedLetter, onLetterChange, visibleCategories, selectedCategories, onToggleCategory,
  showAllCategories, onToggleAllCategories,
  showAlphabet, // 🎯 Nouveau prop
}) {
  const tabs = [
    { id: 'creators', label: 'Créateurs', icon: Users },
    { id: 'brands', label: 'Marques', icon: Building2 },
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'products', label: 'Produits', icon: Shirt },
  ];

  return (
    <section className="sticky top-0 z-30 border-b border-black/10 bg-[#F9F8F6]/95 shadow-sm backdrop-blur-md">
      {/* 🎯 LES ONGLETS 360° */}
      <div className="mx-auto max-w-[1500px] px-4 pt-4 sm:px-6 lg:px-10">
        <div className="flex overflow-x-auto border-b border-black/10 pb-0 [scrollbar-width:none]">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#B85C38] text-[#B85C38] bg-[#B85C38]/5'
                  : 'border-transparent text-gray-500 hover:text-black hover:bg-black/5'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* FILTRES EXISTANTS (adaptés) */}
      <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-black/65">
            <SlidersHorizontal size={15} className="text-[#9C4A2A]" /> Affiner les résultats
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:flex xl:flex-1 xl:justify-end">
            <label className="flex min-h-11 items-center gap-3 border border-black/15 bg-white px-3 xl:max-w-[230px]">
              <ArrowDownUp size={15} className="text-[#9C4A2A]" />
              <select value={sortOrder} onChange={(e) => onSortChange(e.target.value)} className="w-full bg-transparent py-2.5 text-xs outline-none">
                <option value="az">Nom : A à Z</option>
                <option value="za">Nom : Z à A</option>
                <option value="recent">Ajouts récents</option>
              </select>
            </label>

            <button onClick={onReset} disabled={!hasActiveFilters} className="inline-flex min-h-11 items-center justify-center gap-2 border border-black/15 px-4 text-[10px] font-bold uppercase tracking-[0.12em] hover:border-[#9C4A2A] hover:text-[#9C4A2A] disabled:opacity-35">
              <RotateCcw size={13} /> Réinitialiser
            </button>
          </div>
        </div>

        {/* Alphabet (seulement pour les créateurs/marques) */}
        {showAlphabet && (
          <div className="mt-4 border-t border-black/10 pt-3">
            <div className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">Par ordre alphabétique</div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:thin]">
              {ALPHABET.map((letter) => (
                <button key={letter} onClick={() => onLetterChange(letter)} className={`flex h-8 min-w-8 items-center justify-center border px-2 text-[10px] font-bold ${selectedLetter === letter ? 'border-[#2E1B20] bg-[#2E1B20] text-white' : 'border-transparent text-black/55 hover:bg-white'}`}>
                  {letter === 'ALL' ? 'Tous' : letter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Catégories (seulement pour les créateurs) */}
        {activeTab === 'creators' && (
          <div className="mt-4 border-t border-black/10 pt-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[9px] font-bold uppercase tracking-[0.18em] text-black/45">Univers créatif</div>
              <button onClick={onToggleAllCategories} className="text-[10px] font-bold uppercase text-[#7C432B]">
                {showAllCategories ? 'Réduire' : 'Toutes'}
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleCategories.map((category) => (
                <FilterChip key={category.id} active={selectedCategories.includes(category.id)} onClick={() => onToggleCategory(category.id)}>
                  {category.name}
                </FilterChip>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}