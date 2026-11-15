// src/components/immersion/BoutiqueCard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🎯 IMPORT AJOUTÉ
import { Clock3, ExternalLink, MapPin, Navigation, Phone, Store } from 'lucide-react';
import AfricanMotif from '@/components/ui/AfricanMotif';
import {
  getOpeningHours,
  mapsUrl,
  safeExternalUrl,
  typeLabel,
} from '@/utils/immersionHelpers';

export default function BoutiqueCard({ boutique, index }) {
  const navigate = useNavigate(); // 🎯 HOOK AJOUTÉ
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [boutique.resolvedImage]);

  const website = safeExternalUrl(boutique.website_url);
  const directions = mapsUrl(boutique);
  const place = [boutique.cityName, boutique.countryName].filter(Boolean).join(', ');
  const showImage = boutique.resolvedImage && !imageFailed;

  // 🎯 FONCTION POUR ALLER VERS LA PAGE DÉTAIL
  const handleCardClick = () => {
    navigate(`/boutiques/${boutique.id}`);
  };

  // 🎯 FONCTION POUR STOPPER LA REDIRECTION QUAND ON CLIQUE SUR UN BOUTON INTERNE
  const handleActionClick = (e) => {
    e.stopPropagation();
  };

  return (
    <article 
      onClick={handleCardClick} 
      className="group flex min-w-0 flex-col border border-black/10 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[8px_8px_0_#D9C2A3] cursor-pointer"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E8E0D3]">
        {showImage ? (
          <img
            src={boutique.resolvedImage}
            alt={boutique.image_alt || `Vue de ${boutique.name}`}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#E8E0D3] text-[#6A5146]">
            <AfricanMotif
              className="absolute inset-0 h-full w-full opacity-20"
              color="#B85C38"
            />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-[#6A5146]/40 bg-[#F9F8F6]/70">
              <Store size={25} strokeWidth={1.2} />
            </div>
            <span className="relative text-[9px] font-bold uppercase tracking-[0.18em]">
              Photo à ajouter
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

        <div className="absolute left-4 top-4 flex items-center gap-2 bg-[#F9F8F6] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.13em] text-[#2E1B20]">
          <span className={`h-1.5 w-1.5 rounded-full ${boutique.type === 'online' ? 'bg-[#642B75]' : 'bg-[#B85C38]'}`} />
          {typeLabel(boutique.type)}
        </div>

        <span className="absolute bottom-3 left-4 font-mono text-xs text-white/80">
          AG / {String(index + 1).padStart(2, '0')}
        </span>

        {boutique.is_demo && (
          <span className="absolute bottom-3 right-3 bg-[#D4A84B] px-2 py-1 text-[8px] font-bold uppercase tracking-widest text-[#2E1B20]">
            Aperçu
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {boutique.brandName && (
              <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#9A6142]">
                {boutique.brandName}
              </p>
            )}
            <h2 className="font-['Playfair_Display'] text-2xl leading-tight text-[#21191B] sm:text-[1.7rem]">
              {boutique.name}
            </h2>
          </div>
          <span className="shrink-0 font-mono text-[10px] text-black/35">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {place && (
          <p className="mb-4 flex items-center gap-2 text-xs text-gray-600">
            <MapPin size={14} className="shrink-0 text-[#B85C38]" />
            <span>{place}</span>
          </p>
        )}

        {boutique.address && (
          <p className="mb-4 text-xs leading-5 text-gray-500">{boutique.address}</p>
        )}

        <div className="mt-auto border-t border-black/10 pt-4">
          {getOpeningHours(boutique.opening_hours) && (
            <p className="mb-4 flex items-start gap-2 text-[11px] leading-5 text-gray-500">
              <Clock3 size={13} className="mt-0.5 shrink-0" />
              <span>{getOpeningHours(boutique.opening_hours)}</span>
            </p>
          )}

          {boutique.phone && (
            <p className="mb-3 flex items-center gap-2 text-xs text-gray-600">
              <Phone size={13} className="text-[#B85C38]" />
              {/* 🎯 Ajout de onClick pour stopper la redirection */}
              <a href={`tel:${boutique.phone}`} onClick={handleActionClick} className="hover:underline">
                {boutique.phone}
              </a>
            </p>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                onClick={handleActionClick} // 🎯 Ajout de onClick
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 bg-[#2E1B20] px-3 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#B85C38]"
              >
                Site officiel <ExternalLink size={13} />
              </a>
            )}
            {directions && boutique.type !== 'online' && (
              <a
                href={directions}
                target="_blank"
                rel="noreferrer"
                onClick={handleActionClick} // 🎯 Ajout de onClick
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 border border-black/20 px-3 py-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#2E1B20] transition-colors hover:border-[#B85C38] hover:text-[#B85C38]"
              >
                Itinéraire <Navigation size={13} />
              </a>
            )}
            {!website && !directions && !boutique.phone && (
              <p className="text-[10px] leading-5 text-gray-400">
                Les coordonnées seront ajoutées après vérification.
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}