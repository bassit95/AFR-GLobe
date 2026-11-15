// src/pages/CreatorProfile.jsx
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Trophy, MapPin, Globe } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import CreatorCard from '../components/creators/CreatorCard';
import Marquee from '../components/ui/Marquee';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import useCreatorProfile from '../hooks/useCreatorProfile';

export default function CreatorProfile() {
  // Alias pour rester compatible avec une route :creatorId
  const { creatorId: slug } = useParams();
  const { creator, relatedCreators, loading, error } = useCreatorProfile(slug);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <LoadingState message="Chargement du journal..." />
      </main>
    );
  }

  if (error || !creator) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6">
        <ErrorMessage
          type={error?.type || 'notFound'}
          title="Profil indisponible"
          message={error?.message || 'Ce créateur n’existe pas ou n’est pas publié.'}
          onRetry={() => window.location.reload()}
        />
      </main>
    );
  }

  return (
    <main className="bg-[#F9F8F6] text-[#1A1A1A] font-['Inter'] min-h-screen selection:bg-black selection:text-white">
      
      {/* ===================== HERO ===================== */}
      <section className="border-b border-gray-300 bg-[#F9F8F6]">
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
          
          <div className="w-full md:w-1/2 relative bg-[#EFE8DC] min-h-[60vh] md:min-h-full">
            <ImageWithFallback
              src={creator.cover_image || creator.profile_image}
              alt={`Couverture de ${creator.name}`}
              nameForFallback={creator.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10 pointer-events-none" />

            {/* 🎯 BOUTON RETOUR INTÉGRÉ ICI (Assez bas pour éviter le header) */}
            <Link
              to="/creators"
              className="absolute top-28 left-6 md:top-32 md:left-10 z-30 inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300"
            >
              <ArrowLeft size={14} />
              Retour à l'index
            </Link>

            <div className="absolute bottom-0 left-0 p-6 md:p-12 text-white mix-blend-difference z-20">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-['Playfair_Display'] tracking-tight leading-none">
                {creator.name}
              </h1>
            </div>
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-16 lg:p-24 flex flex-col justify-between">
            <div>
              <div className="mb-12 flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                <span>Profil Créateur</span>
                <span className="w-8 h-px bg-gray-400"></span>
                <span>{creator.country_of_origin?.name || 'Afrique'}</span>
              </div>

              <h1 className="text-4xl md:hidden font-['Playfair_Display'] mb-6">{creator.name}</h1>

              <h2 className="text-2xl md:text-3xl lg:text-4xl font-['Playfair_Display'] italic text-gray-800 leading-snug mb-12">
                "{creator.short_bio}"
              </h2>

              <div className="prose prose-sm md:prose-base text-gray-600 leading-relaxed text-justify">
                <p>{creator.biography || creator.short_bio}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-300 mt-16">
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Spécialités</span>
                <p className="text-xs font-medium leading-relaxed">
                  {creator.styles?.map(s => s.name).join(' · ') || 'Non spécifié'}
                </p>
              </div>
              <div>
                <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Catégories</span>
                <p className="text-xs font-medium leading-relaxed">
                  {creator.categories?.map(c => c.name).join(' · ') || 'Non spécifié'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BIOGRAPHIE ===================== */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-3">
            <div className="sticky top-24">
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">À propos</span>
              <div className="space-y-6 text-sm">
                <div>
                  <span className="block text-gray-400 text-[10px] uppercase mb-1">Origine</span>
                  <span className="flex items-center gap-2">
                    {creator.country_of_origin?.code && (
                      <img
                        src={`https://flagcdn.com/24x18/${creator.country_of_origin.code.toLowerCase()}.png`}
                        alt="flag"
                        className="w-4 h-3 border border-gray-200"
                      />
                    )}
                    {creator.country_of_origin?.name || 'Afrique'}
                  </span>
                </div>
                <div>
                  <span className="block text-gray-400 text-[10px] uppercase mb-1">Basé à</span>
                  <span>{creator.city_of_residence?.name || creator.country_of_residence?.name || 'Diaspora'}</span>
                </div>

                {creator.website_url && (
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase mb-1">Site Web</span>
                    <a href={creator.website_url} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-gray-500 flex items-center gap-1">
                      Visiter <ArrowUpRight size={12} />
                    </a>
                  </div>
                )}

                {creator.social_links?.instagram && (
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase mb-1">Réseaux</span>
                    <a href={creator.social_links.instagram} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-gray-500">
                      Instagram ↗
                    </a>
                  </div>
                )}

                {/* Liens vers les marques associées */}
                {creator.brands && creator.brands.length > 0 && (
                  <div>
                    <span className="block text-gray-400 text-[10px] uppercase mb-1">Maison(s)</span>
                    <ul className="space-y-1">
                      {creator.brands.map(brand => (
                        <li key={brand.id}>
                          <Link to={`/marques/${brand.slug}`} className="underline underline-offset-4 hover:text-[#B85C38] flex items-center gap-1">
                            {brand.name} <ArrowUpRight size={12} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-9 md:col-start-4">
            <h2 className="text-3xl md:text-4xl font-['Playfair_Display'] mb-8">L'Héritage & La Vision.</h2>
            <div className="text-base md:text-lg text-gray-700 leading-loose text-justify space-y-6">
              <p className="first-letter:text-7xl first-letter:font-['Playfair_Display'] first-letter:float-left first-letter:mr-4 first-letter:mt-2 first-letter:leading-[0.8]">
                {creator.biography || creator.short_bio}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PALMARÈS ===================== */}
      {creator.awards && creator.awards.length > 0 && (
        <section className="bg-white py-16 md:py-24 px-6 md:px-12 border-b border-gray-300">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <h2 className="text-4xl md:text-5xl font-['Playfair_Display'] text-black leading-tight mb-6">
                Palmarès <br />
                <span className="italic text-gray-400">& Distinctions.</span>
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                Une reconnaissance du travail exceptionnel de {creator.name} au sein de l'industrie de la mode africaine et internationale.
              </p>
              <div className="mt-12 hidden md:block">
                <Trophy size={120} strokeWidth={0.5} className="text-gray-100" />
              </div>
            </div>

            <div className="md:col-span-8 flex flex-col border-t border-black/10">
              {creator.awards.map((award, index) => (
                <a
                  href={award.url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  key={index}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between py-6 border-b border-gray-200 hover:bg-gray-50 transition-colors px-4 -mx-4 cursor-pointer"
                >
                  <div className="flex items-center gap-6 mb-2 sm:mb-0">
                    <span className="text-[10px] font-mono text-gray-400">0{index + 1}</span>
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-black transition-all bg-gray-100">
                      {award.image ? (
                        <img src={award.image} alt={award.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" />
                      ) : (
                        <Trophy size={18} className="text-black" strokeWidth={1.5} />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 sm:px-8 text-left">
                    <h3 className="text-xl md:text-2xl font-['Playfair_Display'] text-black group-hover:italic transition-all">
                      {award.title}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">{award.org}</p>
                  </div>
                  <div className="text-sm font-bold font-['Space_Grotesk'] text-black mt-2 sm:mt-0 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-[#E5FF00] transition-colors">
                    {award.year}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================== PORTFOLIO ===================== */}
      <section className="bg-[#F0EFEB] py-16 md:py-24 px-4 md:px-8 w-full overflow-hidden">
        <div className="w-full mb-12 text-center">
          <h2 className="text-[12vw] md:text-[8vw] font-black uppercase leading-[0.8] tracking-tighter text-[#1A1A1A] font-['Playfair_Display']">
            {creator.name} Outfit
          </h2>
        </div>

        {creator.portfolio_items && creator.portfolio_items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-[1600px] mx-auto">
            {creator.portfolio_items.map((item, index) => {
              let targetUrl = '/marques';
              if (item.collection?.slug) {
                targetUrl = `/collections/${item.collection.slug}`;
              } else if (creator.brands && creator.brands.length > 0 && creator.brands[0]?.slug) {
                targetUrl = `/marques/${creator.brands[0].slug}`;
              }

              return (
                <Link
                  key={item.id}
                  to={targetUrl}
                  className="relative aspect-[3/4] group overflow-hidden bg-gray-300 cursor-pointer border border-gray-300 block"
                >
                 

                  <ImageWithFallback
                    src={item.image || creator.profile_image}
                    alt={item.title || `Création ${index + 1}`}
                    nameForFallback={creator.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <div className="mb-auto">
                      <ArrowUpRight size={32} strokeWidth={1.5} className="transform group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300" />
                    </div>
                    <h3 className="text-4xl md:text-5xl font-black uppercase leading-[0.9] tracking-tighter mb-3">
                      {item.title || `Collection 0${index + 1}`}
                    </h3>
                    <p className="text-[10px] md:text-xs leading-tight font-medium opacity-80 line-clamp-3">
                      {item.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto text-center py-16 border-t border-b border-[#1A1A1A]/20">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#7C432B] mb-4">Portfolio</p>
            <p className="font-['Playfair_Display'] text-3xl md:text-4xl italic text-[#1A1A1A] leading-tight">
              Les créations de {creator.name} <br /> seront bientôt disponibles ici.
            </p>
          </div>
        )}

        <div className="mt-16 w-full max-w-[1600px] mx-auto overflow-hidden">
          <Marquee
            items={['Shop Now', 'Grab Now', 'Collect Now']}
            bgColor="#1A1A1A"
            textColor="#FFFFFF"
            accentColor="#D4A84B"
          />
        </div>
      </section>

      {/* ===================== RECOMMANDATIONS ===================== */}
      {relatedCreators && relatedCreators.length > 0 && (
        <section className="bg-[#F9F8F6] border-t border-gray-300 py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex justify-between items-end mb-12">
              <h2 className="text-3xl md:text-5xl font-['Playfair_Display']">D'autres créateurs.</h2>
              <Link to="/creators" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-500 transition-colors">
                Voir l'index complet
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedCreators.map((c) => (
                <CreatorCard key={c.id} creator={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}