// src/pages/BrandProfile.jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, MapPin, Globe2, Calendar } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import useBrand from '@/hooks/useBrand';

export default function BrandProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: brand, loading, error, refetch } = useBrand(slug);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <LoadingState message="Chargement de la maison…" />
      </main>
    );
  }

  if (error || !brand) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6">
        <ErrorMessage
          type={error?.type || 'notFound'}
          title="Marque indisponible"
          message={error?.message || "Cette marque n'existe pas ou n'est pas publiée."}
          onRetry={error ? refetch : () => navigate('/marques')}
        />
      </main>
    );
  }

  const location = [brand.city?.name, brand.country?.name].filter(Boolean).join(', ');

  return (
    <main className="bg-[#F9F8F6] text-[#1A1A1A] font-['Inter'] min-h-screen">
      {/* HERO */}
      <section className="border-b border-gray-300">
        <div className="flex flex-col md:flex-row min-h-[70vh]">
          <div className="w-full md:w-1/2 relative bg-[#EFE8DC] min-h-[50vh]">
            <ImageWithFallback
              src={brand.cover_image || brand.logo}
              alt={`Couverture de ${brand.name}`}
              nameForFallback={brand.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10 pointer-events-none" />
            
            {/* 🎯 BOUTON RETOUR INTÉGRÉ (Placé plus bas pour éviter le header) */}
            <Link
              to="/marques"
              className="absolute top-28 left-6 md:top-32 md:left-10 z-30 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
            >
              <ArrowLeft size={14} />
              Retour aux marques
            </Link>

            {brand.logo && (
              <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 w-24 h-24 md:w-32 md:h-32 rounded-full border-2 border-white overflow-hidden bg-white shadow-lg">
                <ImageWithFallback
                  src={brand.logo}
                  alt={`Logo ${brand.name}`}
                  nameForFallback={brand.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-between">
            <div>
              <div className="mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span>Maison</span>
                <span className="w-8 h-px bg-gray-400" />
                <span>{brand.country?.name || 'Afrique'}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-['Playfair_Display'] tracking-tight leading-none">
                {brand.name}
              </h1>
              {brand.description && (
                <p className="mt-6 text-base md:text-lg text-gray-700 leading-relaxed text-justify">
                  {brand.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-gray-300 mt-10">
              {location && (
                <div>
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Localisation</span>
                  <span className="text-xs flex items-center gap-1"><MapPin size={12} /> {location}</span>
                </div>
              )}
              {brand.founded_year && (
                <div>
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Fondation</span>
                  <span className="text-xs flex items-center gap-1"><Calendar size={12} /> {brand.founded_year}</span>
                </div>
              )}
              {brand.website_url && (
                <div>
                  <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Site officiel</span>
                  <a href={brand.website_url} target="_blank" rel="noreferrer" className="text-xs underline underline-offset-4 hover:text-[#B85C38] inline-flex items-center gap-1">
                    Visiter <ArrowUpRight size={12} />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CRÉATEURS */}
      {brand.creators?.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 border-b border-gray-300">
          <div className="mb-10">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Direction créative</span>
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display']">Les créateurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {brand.creators.map((c) => (
              <Link
                key={c.id}
                to={`/creators/${c.slug}`}
                className="group flex items-center justify-between gap-4 border border-black/10 bg-white p-5 hover:border-[#B85C38] transition-colors"
              >
                <div>
                  <h3 className="font-['Playfair_Display'] text-xl group-hover:italic transition-all">{c.name}</h3>
                  {c.role && <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{c.role}</p>}
                </div>
                <ArrowUpRight size={18} className="text-[#B85C38] transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* COLLECTIONS */}
      {brand.collections && brand.collections.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 border-b border-gray-300">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
                Archives
              </span>
              <h2 className="text-3xl md:text-4xl font-['Playfair_Display']">Collections</h2>
            </div>
            <span className="text-xs uppercase tracking-widest text-gray-500">
              {brand.collections.length} collection{brand.collections.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brand.collections.map((col) => (
              <Link
                key={col.id}
                to={`/collections/${col.slug || col.id}`}
                className="group flex flex-col border border-black/10 bg-white hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] bg-[#EFE8DC] overflow-hidden">
                  {col.cover_image ? (
                    <ImageWithFallback
                      src={col.cover_image}
                      alt={col.name}
                      nameForFallback={col.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-['Playfair_Display'] italic text-[#B85C38]/30">
                        {col.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-['Playfair_Display'] text-2xl leading-tight text-[#1A1A1A] group-hover:text-[#B85C38] transition-colors mb-2">
                    {col.name}
                  </h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-4">
                    {[col.season, col.year].filter(Boolean).join(' · ') || 'Collection'}
                  </p>
                  <span className="mt-auto flex items-center justify-between border-t border-black/10 pt-3 text-[10px] font-bold uppercase tracking-widest text-[#2E1B20] group-hover:text-[#B85C38]">
                    Voir la collection <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* BOUTIQUES */}
      {brand.boutiques?.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20 border-b border-gray-300">
          <div className="mb-10">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Points de vente</span>
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display']">Boutiques</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {brand.boutiques.map((b) => (
              <Link
                key={b.id}
                to={`/boutiques/${b.id}`}
                className="group flex items-center justify-between gap-4 border border-black/10 bg-white p-5 hover:border-[#B85C38] transition-colors"
              >
                <div>
                  <h3 className="font-['Playfair_Display'] text-xl">{b.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <MapPin size={11} /> {[b.city, b.country].filter(Boolean).join(', ')}
                  </p>
                </div>
                <ArrowUpRight size={18} className="text-[#B85C38]" />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* SOURCES */}
      {brand.sources?.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
          <div className="mb-8">
            <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Pour approfondir</span>
            <h2 className="text-2xl md:text-3xl font-['Playfair_Display']">Sources & références</h2>
          </div>
          <ol className="space-y-3">
            {brand.sources.map((s, i) => (
              <li key={s.id} className="flex gap-3 border-b border-black/5 pb-3 last:border-0">
                <span className="font-mono text-xs text-[#B85C38] pt-1">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1 min-w-0">
                  <a href={s.url} target="_blank" rel="noreferrer" className="group inline-flex items-start gap-2 font-medium text-sm text-[#302722] hover:text-[#B85C38]">
                    <span>{s.title}</span>
                    <ArrowUpRight size={13} className="shrink-0 mt-1" />
                  </a>
                  {s.publisher && <p className="mt-1 text-xs text-[#81766E]">{s.publisher}</p>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}