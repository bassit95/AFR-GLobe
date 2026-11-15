// src/pages/Immersion.jsx
import {
  ArrowRight,
  Globe,
  MapPin,
  Search,
  SlidersHorizontal,
  Store,
  X,
} from 'lucide-react';
import PageBanner from '@/components/Cards/PageBanner';
import BoutiqueCard from '@/components/immersion/BoutiqueCard';
import useImmersionDirectory from '@/hooks/useImmersionDirectory';

import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import EmptyState from '@/components/ui/EmptyState';

const bannerMode = '/images/home/immersion-03.png';

export default function Immersion() {
  const {
    searchInput, setSearchInput,
    countryId, setCountryId,
    cityId, setCityId,
    type, setType,
    page, setPage,
    countries, cities,
    boutiques, meta, countLabel,
    loading, error, optionsError, demoMode,
    resetFilters, retry,
  } = useImmersionDirectory();

  return (
    <>
      <PageBanner title="Immersion." currentPage="Immersion" imageUrl={bannerMode} />

      <main className="min-h-screen bg-[#F9F8F6] text-[#21191B] selection:bg-[#D4A84B] selection:text-[#2E1B20]">
        {demoMode && (
          <div className="bg-[#D4A84B] px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[#2E1B20]">
            Mode aperçu — données fictives
          </div>
        )}

        {/* === BARRE DE FILTRES === */}
        <section className="relative mx-auto max-w-[1440px] px-5 sm:px-8 md:px-12">
          <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-8 lg:col-span-6 md:pb-2">
              <div className="mt-7 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.18em] text-[#B85C38]">
                <span className="h-px w-9 bg-[#1A1A1A]" /> Afrique & diaspora
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-3 border-2 border-[#1A1A1A] bg-[#F9F8F6] p-3 text-[#1A1A1A] shadow-[8px_8px_0_#5C3A21] md:mt-14 md:grid-cols-12 md:gap-0 md:p-2">
            {/* Recherche */}
            <label className="flex min-h-[58px] items-center gap-3 border-b-2 border-[#1A1A1A]/10 px-4 md:col-span-5 md:border-b-0 md:border-r-2 md:border-[#1A1A1A]/10">
              <Search className="shrink-0 text-[#B85C38]" size={19} strokeWidth={1.6} />
              <span className="sr-only">Rechercher une boutique</span>
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Nom d'une boutique, marque, créateur…"
                className="w-full bg-transparent text-sm font-medium text-[#1A1A1A] outline-none placeholder:text-gray-400"
              />
              {searchInput && (
                <button
                  type="button"
                  aria-label="Effacer la recherche"
                  onClick={() => setSearchInput('')}
                  className="text-gray-400 hover:text-[#1A1A1A]"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            {/* Pays */}
            <label className="flex min-h-[58px] items-center gap-3 border-b-2 border-[#1A1A1A]/10 px-4 md:col-span-3 md:border-b-0 md:border-r-2 md:border-[#1A1A1A]/10">
              <Globe className="shrink-0 text-[#B85C38]" size={18} strokeWidth={1.6} />
              <span className="sr-only">Filtrer par pays</span>
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="w-full min-w-0 bg-transparent text-sm font-medium text-[#1A1A1A] outline-none cursor-pointer"
              >
                <option value="all">Tous les pays</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            {/* Ville */}
            <label className="flex min-h-[58px] items-center gap-3 border-b-2 border-[#1A1A1A]/10 px-4 md:col-span-2 md:border-b-0 md:border-r-2 md:border-[#1A1A1A]/10">
              <MapPin className="shrink-0 text-[#B85C38]" size={18} strokeWidth={1.6} />
              <span className="sr-only">Filtrer par ville</span>
              <select
                value={cityId}
                onChange={(e) => setCityId(e.target.value)}
                disabled={countryId === 'all'}
                className="w-full min-w-0 bg-transparent text-sm font-medium text-[#1A1A1A] outline-none disabled:cursor-not-allowed disabled:text-gray-400 cursor-pointer"
              >
                <option value="all">Toutes les villes</option>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>

            {/* Type */}
            <label className="flex min-h-[58px] items-center gap-3 px-4 md:col-span-2">
              <SlidersHorizontal className="shrink-0 text-[#B85C38]" size={17} strokeWidth={1.6} />
              <span className="sr-only">Filtrer par type</span>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full min-w-0 bg-transparent text-sm font-medium text-[#1A1A1A] outline-none cursor-pointer"
              >
                <option value="all">Tous les types</option>
                <option value="physical">Boutique physique</option>
                <option value="online">En ligne</option>
                <option value="both">Physique & en ligne</option>
              </select>
            </label>
          </div>

          {optionsError && (
            <p className="relative mt-4 text-xs font-bold text-[#B85C38]">{optionsError}</p>
          )}
        </section>

        {/* === CONTENU === */}
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 md:px-12 md:py-16">
          {/* Header résultats */}
          <div className="mb-8 flex flex-col gap-4 border-b border-black/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#9A6142]">
                <span className="font-mono">01</span>
                <span className="h-px w-8 bg-[#B85C38]" />
                <span>Explorer le répertoire</span>
              </div>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl">
                Les adresses à découvrir.
              </h2>
              <p className="mt-2 text-xs text-gray-500">
                {countLabel} {loading ? '· Recherche en cours…' : 'dans le répertoire'}
              </p>
            </div>
            <button
              onClick={resetFilters}
              type="button"
              className="inline-flex items-center gap-2 self-start border-b border-black/30 pb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-gray-600 transition-colors hover:border-[#B85C38] hover:text-[#B85C38] sm:self-auto"
            >
              <X size={13} /> Réinitialiser les filtres
            </button>
          </div>

          {/* === ÉTATS === */}
          {loading ? (
            <LoadingState variant="skeleton" count={6} />
          ) : error ? (
            <ErrorMessage
              type={error.type || 'generic'}
              title="Répertoire indisponible"
              message={typeof error === 'string' ? error : error.message}
              onRetry={retry}
            />
          ) : (
            <>
              {/* ✅ Résultats */}
              {boutiques.length > 0 && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                  {boutiques.map((boutique, index) => (
                    <BoutiqueCard
                      key={boutique.id}
                      boutique={boutique}
                      index={
                        (Number(meta.current_page || 1) - 1) *
                          Number(meta.per_page || 12) +
                        index
                      }
                    />
                  ))}
                </div>
              )}

              {/* ✅ FIX B2 — Pagination HORS du boutiques.length > 0
                  → reste visible même quand la page courante est vide */}
              {!demoMode && Number(meta.last_page || 1) > 1 && (
                <div className="mt-12 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => {
                      setPage(Math.max(1, page - 1));
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    className="border border-black/20 px-5 py-3 text-[10px] font-bold uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Précédent
                  </button>
                  <span className="text-xs text-gray-500">
                    Page {meta.current_page || page} / {meta.last_page}
                  </span>
                  <button
                    type="button"
                    disabled={page >= Number(meta.last_page || 1)}
                    onClick={() => {
                      setPage(page + 1);
                      window.scrollTo({ top: 500, behavior: 'smooth' });
                    }}
                    className="border border-black/20 px-5 py-3 text-[10px] font-bold uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    Suivant
                  </button>
                </div>
              )}

              {/* ✅ État vide */}
              {boutiques.length === 0 && (
                <EmptyState
                  title="Aucun point de vente trouvé."
                  description="Essaie un autre nom ou élargis ta recherche à un autre pays."
                  onReset={resetFilters}
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}