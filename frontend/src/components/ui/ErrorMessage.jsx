// src/components/ui/ErrorMessage.jsx
import { AlertCircle, RefreshCw, WifiOff, SearchX, ShieldOff, ServerCrash, AlertTriangle } from 'lucide-react';

const VARIANTS = {
  network:      { icon: WifiOff,       title: 'Connexion perdue',       description: 'Impossible de contacter le serveur.' },
  server:       { icon: ServerCrash,   title: 'Erreur serveur',         description: 'Une erreur est survenue côté serveur.' },
  notFound:     { icon: SearchX,       title: 'Introuvable',            description: 'La ressource n\'existe pas.' },
  forbidden:    { icon: ShieldOff,     title: 'Accès refusé',           description: 'Tu n\'as pas les droits nécessaires.' },
  unauthorized: { icon: ShieldOff,     title: 'Session expirée',        description: 'Reconnecte-toi pour continuer.' },
  validation:   { icon: AlertTriangle, title: 'Données invalides',      description: 'Vérifie les informations saisies.' },
  generic:      { icon: AlertCircle,   title: 'Une erreur est survenue', description: 'Impossible de charger les données.' },
};

export default function ErrorMessage({ type = 'generic', title, message, onRetry }) {
  const config = VARIANTS[type] || VARIANTS.generic;
  const Icon = config.icon;

  return (
    <div className="relative overflow-hidden border border-[#B85C38]/30 bg-[#F3E9E0] px-6 py-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#B85C38]/30 bg-white">
        <Icon size={28} strokeWidth={1.5} className="text-[#B85C38]" />
      </div>
      <h3 className="mt-5 font-['Playfair_Display'] text-2xl text-[#2E1B20]">
        {title || config.title}
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6B3325]">
        {message || config.description}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 border border-[#2E1B20] bg-[#2E1B20] px-5 py-3 text-[10px] font-bold uppercase tracking-[0.15em] text-white transition-colors hover:bg-[#B85C38] hover:border-[#B85C38]"
        >
          <RefreshCw size={13} /> Réessayer
        </button>
      )}
    </div>
  );
}