// src/components/ui/EmptyState.jsx
import { RotateCcw } from 'lucide-react';
import AfricanMotif from './AfricanMotif';

export default function EmptyState({ 
  title = 'Aucun résultat',
  description = 'Essaie de modifier tes filtres ou de faire une autre recherche.',
  onReset,
}) {
  return (
    <div className="relative overflow-hidden border border-black/10 bg-[#F4F1EA] px-6 py-16 text-center sm:py-24">
      <AfricanMotif 
        className="mx-auto mb-6 h-10 w-40 opacity-40" 
        color="#B85C38" 
      />
      
      <h3 className="font-['Playfair_Display'] text-3xl italic text-[#1A1A1A]">
        {title}
      </h3>
      
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-600">
        {description}
      </p>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 border border-[#2E1B20] bg-[#2E1B20] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#7C432B]"
        >
          <RotateCcw size={13} /> Réinitialiser
        </button>
      )}
    </div>
  );
}