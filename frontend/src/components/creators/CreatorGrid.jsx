// src/components/creators/CreatorGrid.jsx
import { ArrowUpRight, MapPin, Sparkles } from 'lucide-react';
import CreatorCard from './CreatorCard';
import CreatorPagination from './CreatorPagination';
import LoadingState from '../ui/LoadingState';
import ErrorMessage from '../ui/ErrorMessage';
import EmptyState from '../ui/EmptyState';
import { getCountryName } from '../../utils/creatorIndex';

export default function CreatorGrid({
  creators,
  loading,
  error,
  totalCount,
  meta,
  onPageChange,
  onReset,
  onRetry,
}) {
  return (
    <div className="flex-1">
      {/* En-tête */}
      <div className="mb-8 flex flex-col gap-4 border-b border-black/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9C4A2A]">
            <Sparkles size={13} /> Répertoire des talents
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl italic sm:text-4xl">
            Les créateurs à découvrir
          </h2>
        </div>
        {!loading && !error && (
          <div className="text-xs font-bold uppercase text-black/65">
            {totalCount} {totalCount > 1 ? 'créateurs trouvés' : 'créateur trouvé'}
          </div>
        )}
      </div>

      {/* Chargement / Erreur */}
      {loading && <LoadingState variant="skeleton" count={6} />}
      {!loading && error && (
        <ErrorMessage type={error.type} message={error.message} onRetry={onRetry} />
      )}

      {/* ✅ Résultats */}
      {!loading && !error && creators.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 xl:gap-7">
          {creators.map((creator) => (
            <article
              key={creator.id ?? creator.slug}
              className="group relative border border-black/10 bg-white p-3 transition-all hover:-translate-y-1 hover:border-[#B85C38]/60 hover:shadow-[5px_5px_0_#E5D4C3] sm:p-4"
            >
              <CreatorCard creator={creator} />
              <div className="mt-4 flex items-center justify-between gap-2 border-t border-black/10 pt-3 text-[9px] font-bold uppercase text-black/50 group-hover:text-[#7C432B]">
                <span className="flex min-w-0 items-center gap-1.5 truncate">
                  <MapPin size={11} className="shrink-0" />
                  <span className="truncate">{getCountryName(creator)}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1">
                  Profil <ArrowUpRight size={12} />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ✅ FIX B2 — Pagination EN DEHORS de creators.length > 0
          → reste visible même si page vide (ex: filtre → page 2 vide) */}
      {!loading && !error && meta && meta.last_page > 1 && (
        <CreatorPagination
          safePage={meta.current_page}
          totalPages={meta.last_page}
          onPageChange={onPageChange}
        />
      )}

      {/* ✅ État vide */}
      {!loading && !error && creators.length === 0 && (
        <EmptyState onReset={onReset} />
      )}
    </div>
  );
}