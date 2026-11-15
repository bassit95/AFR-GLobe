// src/components/ui/LoadingState.jsx
import { Loader2 } from 'lucide-react';

export default function LoadingState({ 
  message = 'Chargement en cours…',
  variant = 'spinner', // 'spinner' | 'skeleton' | 'inline'
  count = 3,
}) {
  // Spinner simple (pour les pages)
  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#B85C38]" />
        <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8A6B59]">
          {message}
        </p>
      </div>
    );
  }

  // Inline (petit loader dans un bouton)
  if (variant === 'inline') {
    return (
      <span className="inline-flex items-center gap-2 text-xs text-black/50">
        <Loader2 className="h-3 w-3 animate-spin" />
        {message}
      </span>
    );
  }

  // Skeleton (grille de placeholders)
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-7">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse border border-black/10 bg-white p-3 sm:p-4">
          <div className="aspect-[3/4] w-full bg-[#E8E0D3]" />
          <div className="mt-4 h-3 w-2/3 bg-gray-200" />
          <div className="mt-2 h-3 w-1/2 bg-gray-200" />
        </div>
      ))}
    </div>
  );
}