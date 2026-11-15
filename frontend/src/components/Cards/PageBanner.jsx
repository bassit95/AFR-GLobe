// src/components/Cards/PageBanner.jsx
import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import gsap from 'gsap';
import AfricanMotif from '../ui/AfricanMotif';
import ImageWithFallback from '../ui/ImageWithFallback';

// 🎯 Le dictionnaire qui fait le lien entre l'URL et le fil d'Ariane
const BREADCRUMB_MAP = {
  '/creators':    [{ label: 'Accueil', to: '/' }, { label: 'Global Index', to: null }],
  '/marques':     [{ label: 'Accueil', to: '/' }, { label: 'Global Index', to: '/creators' }, { label: 'Marques', to: null }],
  '/collections': [{ label: 'Accueil', to: '/' }, { label: 'Global Index', to: '/creators' }, { label: 'Collections', to: null }],
  '/produits':    [{ label: 'Accueil', to: '/' }, { label: 'Global Index', to: '/creators' }, { label: 'Produits', to: null }],
  '/about':       [{ label: 'Accueil', to: '/' }, { label: 'About Us', to: null }],
  '/contact':     [{ label: 'Accueil', to: '/' }, { label: 'Contact', to: null }],
  '/immersion':   [{ label: 'Accueil', to: '/' }, { label: 'Immersion', to: null }],
  '/resources':   [{ label: 'Accueil', to: '/' }, { label: 'Resource Library', to: null }],
};

function PageBanner({ title, currentPage, imageUrl, subtitle }) {
  const bannerRef = useRef();
  const titleWords = title.split(' ');
  const location = useLocation(); // 🎯 Récupère l'URL actuelle

  // 🎯 On regarde le premier segment de l'URL (ex: "/marques/thebe-magugu" -> "/marques")
  const basePath = '/' + (location.pathname.split('/')[1] || '');

  // 🎯 Si l'URL correspond à une clé de notre dictionnaire, on l'utilise.
  // Sinon, on affiche "Accueil > [Nom de la page actuelle]".
  let breadcrumbs = BREADCRUMB_MAP[basePath];

  if (!breadcrumbs) {
    // Fallback au cas où l'URL n'est pas dans le dictionnaire
    breadcrumbs = [
      { label: 'Accueil', to: '/' },
      { label: currentPage || title, to: null }
    ];
  } else {
    // 🎯 MAGIE : Si on est sur une page de détail (ex: /marques/thebe-magugu),
    // on remplace le dernier élément "Marques" par le nom de la marque (passé dans currentPage).
    const segments = location.pathname.split('/').filter(Boolean);
    if (segments.length > 1 && breadcrumbs[breadcrumbs.length - 1].label !== currentPage) {
        // On copie le tableau pour ne pas modifier le dictionnaire original
        breadcrumbs = [...breadcrumbs];
        // On remplace le dernier élément
        breadcrumbs[breadcrumbs.length - 1] = { label: currentPage || title, to: null };
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleEl = bannerRef.current?.querySelector('.banner-title-container');
      if (titleEl) gsap.from(titleEl, { y: 80, opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 });
      
      const subtitleEl = bannerRef.current?.querySelector('.banner-subtitle');
      if (subtitleEl) gsap.from(subtitleEl, { y: 20, opacity: 0, duration: 1, delay: 0.6, ease: 'power3.out' });
    }, bannerRef);
    return () => ctx.revert();
  }, [title]);

  return (
    <div ref={bannerRef} className="relative w-full min-h-[75vh] md:min-h-[84vh] flex flex-col justify-between overflow-hidden bg-[#1A0F12]">
      <ImageWithFallback src={imageUrl} alt={title} nameForFallback={title} className="absolute inset-0 w-full h-full object-cover object-center z-0" loading="eager" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-10 pointer-events-none" />
      <AfricanMotif className="absolute right-4 top-24 hidden md:block h-48 w-10 opacity-60 z-20 pointer-events-none" color="#F4F1EA" />
      <AfricanMotif className="absolute right-4 bottom-24 hidden md:block h-48 w-10 opacity-60 z-20 pointer-events-none" color="#F4F1EA" />

      <div className="relative z-20 w-full px-6 md:px-12 lg:px-16 pb-12 md:pb-16 lg:pb-20 mt-auto">
        <div className="banner-title-container flex flex-col items-start">
          
          {/* 🎯 FIL D'ARIANE AUTOMATIQUE */}
          <nav aria-label="Breadcrumb" className="relative z-50 pointer-events-auto mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              {breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return (
                  <li key={index} className="flex items-center gap-2">
                    {/* Si c'est le dernier, on l'affiche en blanc. Sinon, c'est un lien cliquable */}
                    {crumb.to && !isLast ? (
                      <Link to={crumb.to} className="hover:text-white transition-colors cursor-pointer">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? "text-white" : ""}>{crumb.label}</span>
                    )}
                    {!isLast && <ChevronRight size={12} className="text-white/50" />}
                  </li>
                );
              })}
            </ol>
          </nav>

          <h1 className="impact text-[18vw] md:text-[14vw] lg:text-[12vw] uppercase leading-[0.8] tracking-tight text-white flex flex-col pointer-events-none">
            {titleWords.map((word, index) => (
              <span key={`${word}-${index}`} className="block">{word}</span>
            ))}
          </h1>
        </div>
        {subtitle && <p className="banner-subtitle mt-6 max-w-2xl text-sm md:text-base text-white/70 leading-relaxed font-medium">{subtitle}</p>}
      </div>
    </div>
  );
}

export default PageBanner;