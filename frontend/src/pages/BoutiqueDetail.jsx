// src/pages/BoutiqueDetail.jsx
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Clock3, Mail, MapPin, Navigation, Phone, Store } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import LoadingState from '@/components/ui/LoadingState';
import ErrorMessage from '@/components/ui/ErrorMessage';
import AfricanMotif from '@/components/ui/AfricanMotif';
import useBoutique from '@/hooks/useBoutique';
import { getOpeningHours, mapsUrl, safeExternalUrl, typeLabel } from '@/utils/immersionHelpers';

export default function BoutiqueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: boutique, loading, error, refetch } = useBoutique(id);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center">
        <LoadingState message="Chargement de la boutique…" />
      </main>
    );
  }

  if (error || !boutique) {
    return (
      <main className="min-h-screen bg-[#F9F8F6] flex items-center justify-center px-6">
        <ErrorMessage
          type={error?.type || 'notFound'}
          title="Boutique indisponible"
          message={error?.message || "Cette boutique n'existe pas ou n'est pas publiée."}
          onRetry={error ? refetch : () => navigate('/immersion')}
        />
      </main>
    );
  }

  const place = [boutique.city?.name, boutique.country?.name].filter(Boolean).join(', ');
  const website = safeExternalUrl(boutique.website_url);
  const directions = boutique.latitude && boutique.longitude
    ? `https://www.google.com/maps?q=${boutique.latitude},${boutique.longitude}`
    : mapsUrl({
        address: boutique.address,
        cityName: boutique.city?.name,
        countryName: boutique.country?.name,
      });
  const hours = getOpeningHours(boutique.opening_hours);

  return (
    <main className="bg-[#F9F8F6] text-[#1A1A1A] min-h-screen">
      {/* HERO */}
      <section className="relative border-b border-gray-300 bg-[#E8E0D3]">
        <div className="max-w-6xl mx-auto px-6 md:px-12 pt-8 md:pt-12">
          <Link
            to="/immersion"
            className="inline-flex items-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#6F6259] hover:text-[#B85C38] transition-colors"
          >
            <ArrowLeft size={14} className="mr-2" /> Répertoire
          </Link>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center pb-12 md:pb-16">
            <div className="md:col-span-6 relative aspect-[4/3] overflow-hidden border border-black/10 bg-[#F9F8F6]">
              {boutique.image ? (
                <ImageWithFallback
                  src={boutique.image}
                  alt={boutique.name}
                  nameForFallback={boutique.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#E8E0D3] text-[#6A5146]">
                  <AfricanMotif className="absolute inset-0 h-full w-full opacity-20" color="#B85C38" />
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-[#6A5146]/40 bg-[#F9F8F6]/70">
                    <Store size={28} strokeWidth={1.2} />
                  </div>
                  <span className="relative text-[10px] font-bold uppercase tracking-[0.18em]">
                    Photo à ajouter
                  </span>
                </div>
              )}
              <span className="absolute top-4 left-4 bg-[#F9F8F6] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.13em] text-[#2E1B20]">
                {typeLabel(boutique.type)}
              </span>
            </div>

            <div className="md:col-span-6">
              {boutique.brand?.name && (
                <Link
                  to={`/marques/${boutique.brand.slug}`}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A6142] hover:text-[#B85C38]"
                >
                  {boutique.brand.name} ↗
                </Link>
              )}
              <h1 className="mt-3 text-4xl md:text-5xl font-['Playfair_Display'] leading-tight">
                {boutique.name}
              </h1>
              {place && (
                <p className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={15} className="text-[#B85C38]" />
                  <span>{place}</span>
                </p>
              )}
              {boutique.address && (
                <p className="mt-2 text-sm leading-6 text-gray-500">{boutique.address}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INFOS */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Infos pratiques */}
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Informations pratiques</h2>

            {hours && (
              <div className="flex items-start gap-3 border-b border-black/10 pb-3">
                <Clock3 size={16} className="text-[#B85C38] mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Horaires</p>
                  <p className="text-sm text-gray-700 mt-1">{hours}</p>
                </div>
              </div>
            )}

            {boutique.phone && (
              <div className="flex items-start gap-3 border-b border-black/10 pb-3">
                <Phone size={16} className="text-[#B85C38] mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Téléphone</p>
                  <a href={`tel:${boutique.phone}`} className="text-sm text-gray-700 mt-1 hover:underline">
                    {boutique.phone}
                  </a>
                </div>
              </div>
            )}

            {boutique.email && (
              <div className="flex items-start gap-3 border-b border-black/10 pb-3">
                <Mail size={16} className="text-[#B85C38] mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Email</p>
                  <a href={`mailto:${boutique.email}`} className="text-sm text-gray-700 mt-1 hover:underline">
                    {boutique.email}
                  </a>
                </div>
              </div>
            )}

            {!hours && !boutique.phone && !boutique.email && (
              <p className="text-sm text-gray-500 italic">
                Les coordonnées seront ajoutées après vérification.
              </p>
            )}
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Actions</h2>

            {website && (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 bg-[#2E1B20] px-5 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white hover:bg-[#B85C38] transition-colors"
              >
                Visiter le site officiel <ExternalLinkIcon />
              </a>
            )}

            {directions && boutique.type !== 'online' && (
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 border border-black/20 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#2E1B20] hover:border-[#B85C38] hover:text-[#B85C38] transition-colors"
              >
                Itinéraire Google Maps <Navigation size={14} />
              </a>
            )}
          </div>
        </div>

        {/* Sources */}
        {boutique.sources?.length > 0 && (
          <div className="mt-16 border-t border-black/10 pt-8">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4">Sources</h2>
            <ol className="space-y-2">
              {boutique.sources.map((s, i) => (
                <li key={s.id} className="flex gap-3">
                  <span className="font-mono text-xs text-[#B85C38] pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-[#302722] hover:text-[#B85C38] inline-flex items-center gap-2">
                    {s.title} <ArrowUpRight size={12} />
                  </a>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>
    </main>
  );
}

function ExternalLinkIcon() {
  return <ArrowUpRight size={14} />;
}