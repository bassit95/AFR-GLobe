// src/components/layout/Footer/Footer.jsx
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Mail } from 'lucide-react';

const exploreLinks = [
  { label: 'Global Index', to: '/creators' },
  { label: 'Immersion', to: '/immersion' },
  { label: 'Marques', to: '/brands' },
  { label: 'Collections', to: '/collections' },
  { label: 'Resource Library', to: '/resources' },
];

const aboutLinks = [
  { label: 'À propos', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

function FooterMotif({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 160 160" fill="none" className={className}>
      {Array.from({ length: 4 }, (_, index) => (
        <g key={index} transform={`translate(${index * 40} 0)`} stroke="currentColor" strokeWidth="1.2">
          <path d="M20 4 36 20 20 36 4 20Z" />
          <path d="M20 11 29 20 20 29 11 20Z" />
          <path d="M4 20H0M36 20H40M20 4V0M20 36V40" />
          <path d="M20 44 36 60 20 76 4 60Z" />
          <path d="M20 51 29 60 20 69 11 60Z" />
          <path d="M4 60H0M36 60H40M20 44V40M20 76V80" />
          <path d="M20 84 36 100 20 116 4 100Z" />
          <path d="M20 91 29 100 20 109 11 100Z" />
          <path d="M4 100H0M36 100H40M20 84V80M20 116V120" />
          <path d="M20 124 36 140 20 156 4 140Z" />
          <path d="M20 131 29 140 20 149 11 140Z" />
        </g>
      ))}
    </svg>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="group inline-flex w-fit items-center gap-2 text-sm text-[#F4F1EA]/70 transition-colors duration-200 hover:text-[#D4A84B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A84B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#2E1B20]"
    >
      <span>{children}</span>
      <ArrowUpRight
        size={13}
        aria-hidden="true"
        className="opacity-0 -translate-x-1 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
      />
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-[#2E1B20] text-[#F4F1EA]">
      <FooterMotif className="pointer-events-none absolute -left-10 top-10 hidden h-64 w-64 text-[#D4A84B]/20 md:block" />
      <FooterMotif className="pointer-events-none absolute -right-12 top-1/3 hidden h-72 w-72 rotate-12 text-[#B85C38]/25 lg:block" />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 pb-6 pt-12 sm:px-8 md:pt-16 lg:px-12">
        {/* Partie supérieure : identité et navigation */}
        <div className="grid grid-cols-1 gap-12 border-b border-[#D4A84B]/25 pb-12 md:grid-cols-12 md:gap-8 md:pb-16">
          <div className="md:col-span-6 lg:col-span-7">
            <Link
              to="/"
              aria-label="Africa Global — accueil"
              className="group inline-flex flex-col leading-[0.82] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A84B]"
            >
              <span className="font-['Playfair_Display'] text-4xl italic tracking-tight text-[#D4A84B] sm:text-5xl">
                Africa
              </span>
              <span className="mt-1 text-[3.4rem] font-black uppercase tracking-[-0.08em] text-[#F4F1EA] transition-colors duration-300 group-hover:text-[#D4A84B] sm:text-7xl lg:text-8xl">
                Global<span className="text-[#B85C38]">.</span>
              </span>
            </Link>

            <p className="mt-7 max-w-md text-sm leading-7 text-[#F4F1EA]/70 sm:text-base sm:leading-8">
              Un répertoire vivant des créateurs, des marques et des savoir-faire africains et de la diaspora.
              Des histoires à découvrir. Des univers à explorer.
            </p>
          </div>

          <nav aria-label="Explorer Africa Global" className="md:col-span-3 lg:col-span-2">
            <h2 className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A84B]">
              <span className="h-px w-6 bg-[#D4A84B]/60" /> Explorer
            </h2>
            <div className="flex flex-col items-start gap-3">
              {exploreLinks.map((link) => (
                <FooterLink key={link.to} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
            </div>
          </nav>

          <nav aria-label="À propos d’Africa Global" className="md:col-span-3 lg:col-span-3">
            <h2 className="mb-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A84B]">
              <span className="h-px w-6 bg-[#D4A84B]/60" /> Africa Global
            </h2>
            <div className="flex flex-col items-start gap-3">
              {aboutLinks.map((link) => (
                <FooterLink key={link.to} to={link.to}>
                  {link.label}
                </FooterLink>
              ))}
              <Link
                to="/contact"
                className="mt-2 inline-flex items-center gap-2 text-sm text-[#F4F1EA]/70 transition-colors hover:text-[#D4A84B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4A84B]"
              >
                <Mail size={14} aria-hidden="true" />
                Nous contacter
              </Link>
            </div>
            <p className="mt-7 max-w-xs text-xs leading-6 text-[#F4F1EA]/45">
              Une plateforme pour découvrir les talents, les parcours et les idées qui façonnent la création contemporaine.
            </p>
          </nav>
        </div>

        

        {/* Bas de page */}
        <div className="flex flex-col gap-3 border-t border-[#D4A84B]/25 pt-5 text-[9px] font-medium uppercase tracking-[0.14em] text-[#F4F1EA]/45 sm:flex-row sm:items-center sm:justify-between sm:text-[10px]">
          <span>© {year} Africa Global. Tous droits réservés.</span>
          <span className="flex items-center gap-2">
            Conçu pour faire circuler les idées
          </span>
        </div>
      </div>
    </footer>
  );
}