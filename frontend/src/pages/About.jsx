import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Eye,
  UsersRound,
  BookOpen,
} from 'lucide-react';
import PageBanner from '../components/Cards/PageBanner';

// 🎯 IMPORT DES COMPOSANTS RÉUTILISABLES
import AfricanMotif from '../components/ui/AfricanMotif';
import MainBtn from '../components/ui/button/MainBtn';
import Marquee from '../components/ui/Marquee';
import CategoryCard from '../components/Cards/CategoryCard';
import EditorialLabel from '../components/ui/EditorialLabel';
import EditorialSpread from '../components/Cards/EditorialSpread'; 

const bannerAbout = '/images/banner/banner-01.jpeg';
const bannerImage = '/images/banner/banner-05.jpeg';
const bannerArticle = '/images/banner/banner-03.jpeg';
const bannerMode = '/images/banner/banner-02.jpeg';

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default function About() {
  return (
    <>
      <PageBanner
        title="Africa Global."
        currentPage="À propos"
        imageUrl={bannerMode}
      />

      <main className="bg-[#F9F8F6] text-[#1A1A1A] font-['Inter'] min-h-screen selection:bg-black selection:text-white">
        
        {/* ===================================================================
            HERO — Couverture pleine largeur + texte magazine en dessous
        =================================================================== */}
        <section className="relative bg-[#F9F8F6] border-b border-gray-300">
          <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
              
              {/* Colonne gauche : label + citation */}
              <div className="md:col-span-5 md:col-start-2">
                <EditorialLabel prefix="N°01" text="À propos de nous" />

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-['Playfair_Display'] italic text-gray-800 leading-snug mb-10">
                  « Découvrir les créateurs africains, comprendre leurs univers et faire rayonner leurs histoires. »
                </h2>

                {/* Métadonnées en dessous de la citation */}
                <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-300">
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Terrain
                    </span>
                    <p className="text-xs font-medium leading-relaxed">Afrique & Diaspora</p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">
                      Depuis
                    </span>
                    <p className="text-xs font-medium leading-relaxed">Édition indépendante</p>
                  </div>
                </div>
              </div>

              {/* Colonne droite : corps de texte + motif */}
              <div className="md:col-span-5 relative">
                <AfricanMotif
                  className="hidden md:block absolute -left-8 top-0 h-32 w-6 opacity-40"
                  color="#B85C38"
                />

                <div className="prose prose-sm md:prose-base text-gray-600 leading-relaxed text-justify">
                  <p className="first-letter:text-6xl first-letter:font-['Playfair_Display'] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.85] first-letter:text-[#B85C38]">
                    Africa Global est une plateforme éditoriale et un répertoire numérique dédiés à la découverte et à la valorisation des créateurs africains et de la diaspora. Des talents émergents aux maisons établies, nous mettons en lumière les personnes, les univers et les histoires qui façonnent la création contemporaine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            OUVERTURE — Utilisation du composant EditorialSpread
        =================================================================== */}
        <EditorialSpread 
          leftImage={bannerImage}
          leftImageAlt="Univers visuel de la création africaine"
          leftLabel="Notre manifeste"
          leftTitle={<>L’Afrique<br />crée.</>}
          leftText="Africa Global est une plateforme éditoriale et un répertoire numérique dédiés à la découverte et à la valorisation des créateurs africains et de la diaspora. Des talents émergents aux maisons établies, nous mettons en lumière les personnes, les univers et les histoires qui façonnent la création contemporaine."
          leftFolioNumber="01"

          rightImage={bannerArticle}
          rightImageAlt="Détail d'une création et de son langage visuel"
          rightLabel="Notre conviction"
          rightTitle={<>Le monde<br />mérite de<br className="hidden lg:block" /> le voir.</>}
          rightText={
            <>
              <p>La création africaine mérite mieux qu’une apparition passagère dans les tendances : elle mérite un espace où son savoir-faire, sa diversité et ses idées peuvent être explorés en profondeur.</p>
              <p><strong className="font-semibold text-black">Notre ambition :</strong> rendre ces univers plus visibles, plus faciles à découvrir et mieux documentés, sans réduire leur richesse à une seule esthétique.</p>
            </>
          }
          rightFolioNumber="02"
        />

        {/* ===================================================================
            MISSION — Bloc bordeaux, split image + contenu (accent doré)
        =================================================================== */}
        <section className="relative bg-[#2E1B20] text-[#F4F1EA] border-y border-[#D4A84B]/20 overflow-hidden">
          <AfricanMotif
            className="pointer-events-none absolute left-0 top-0 bottom-0 hidden w-10 opacity-50 md:block"
            color="#D4A84B"
          />
          <AfricanMotif
            className="pointer-events-none absolute right-0 top-0 bottom-0 hidden w-10 opacity-50 md:block"
            color="#D4A84B"
          />

          <div className="relative max-w-[1500px] mx-auto grid grid-cols-1 md:grid-cols-12">
            <div className="relative min-h-[400px] md:min-h-[640px] md:col-span-5 overflow-hidden bg-[#1A0F12]">
              <img
                src={bannerAbout}
                alt="Portrait éditorial évoquant la diversité des créateurs africains"
                className="absolute inset-0 w-full h-full object-cover object-top"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#2E1B20] via-[#2E1B20]/50 to-transparent" />

              <AfricanMotif
                className="absolute right-3 top-3 h-24 w-8 opacity-90"
                color="#D4A84B"
              />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10">
                <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4A84B] mb-4">
                  Manifeste · Vol. 03
                </span>
                <p className="font-['Playfair_Display'] italic text-2xl md:text-3xl leading-snug">
                  « La création africaine n'est pas un style. C'est une manière de voir le monde. »
                </p>
              </div>
            </div>

            <div className="relative md:col-span-7 flex flex-col justify-center px-6 py-16 sm:px-10 md:px-12 lg:px-20">
              <AfricanMotif
                className="pointer-events-none absolute right-4 top-8 hidden h-32 w-7 opacity-25 md:block"
                color="#D4A84B"
              />

              <EditorialLabel prefix="N°03" text="Notre mission" light />

              <h2 className="mb-8 max-w-3xl impact text-4xl uppercase leading-[0.94] tracking-tight sm:text-5xl lg:text-6xl">
                Rendre la créativité africaine{' '}
                <span className="text-[#D4A84B]">visible, accessible</span> et incontournable.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                Nous réunissons les créateurs, les marques, les collections et les ressources qui permettent de mieux comprendre la scène créative africaine. Notre approche éditoriale aide chaque visiteur à découvrir des talents, à explorer leurs démarches et à aller au-delà de l'image.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-5 border-t border-[#D4A84B]/25 pt-7 sm:grid-cols-3 sm:gap-6">
                <div className="flex items-start gap-3">
                  <Eye size={23} strokeWidth={1.3} className="mt-0.5 shrink-0 text-[#D4A84B]" />
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.16em]">Découvrir</h3>
                    <p className="mt-1 text-xs leading-5 text-white/65">Des talents et des univers singuliers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <BookOpen size={23} strokeWidth={1.3} className="mt-0.5 shrink-0 text-[#D4A84B]" />
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.16em]">Comprendre</h3>
                    <p className="mt-1 text-xs leading-5 text-white/65">Les histoires, les idées et les savoir-faire.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UsersRound size={23} strokeWidth={1.3} className="mt-0.5 shrink-0 text-[#D4A84B]" />
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.16em]">Valoriser</h3>
                    <p className="mt-1 text-xs leading-5 text-white/65">Le travail des créateurs et des marques.</p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <MainBtn path="/contact" text="Soyez global africa" variant="outline" className="bg-transparent! border border-[#D4A84B]! text-[#D4A84B]! hover:bg-[#D4A84B]! hover:text-[#2E1B20]!" />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            VISION — Texte à gauche, collage à droite
        =================================================================== */}
        <section className="relative bg-[#F0EFEB] px-6 md:px-12 py-16 md:py-24 border-b border-gray-300 overflow-hidden">
          <AfricanMotif
            className="pointer-events-none absolute right-0 bottom-0 top-0 hidden w-10 opacity-40 md:block"
            color="#7C432B"
          />

          <div className="relative max-w-[1300px] mx-auto grid grid-cols-1 items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <EditorialLabel prefix="N°04" text="Notre vision" />
              <h2 className="mb-6 impact text-4xl uppercase leading-[0.98] tracking-tight sm:text-5xl lg:text-6xl">
                Une nouvelle perspective sur la création africaine.
              </h2>
              <p className="text-sm leading-7 text-gray-700 sm:text-base sm:leading-8">
                Nous imaginons un monde où les créateurs africains sont découverts pour leur talent, reconnus pour leur savoir-faire et considérés pour leur contribution à la création mondiale. Africa Global souhaite devenir un point de rencontre entre celles et ceux qui créent et celles et ceux qui veulent découvrir, soutenir et comprendre leurs univers.
              </p>
              <p className="mt-5 border-l-2 border-[#B85C38] pl-4 font-['Playfair_Display'] text-xl italic leading-snug sm:text-2xl">
                Des talents d'aujourd'hui. Les références de demain.
              </p>
            </div>

            <div className="relative md:col-span-7">
              <div className="absolute -right-2 -top-3 h-24 w-24 bg-[#642B75] sm:-right-4 sm:-top-5 sm:h-36 sm:w-36" />
              <AfricanMotif
                className="absolute -left-3 top-8 z-20 h-40 w-8 sm:-left-5 sm:h-52"
                color="#F4F1EA"
              />

              <div className="relative z-10 grid grid-cols-2 gap-3 sm:gap-5">
                <figure className="translate-y-8">
                  <div className="overflow-hidden border border-gray-300 bg-gray-200 shadow-[6px_6px_0_#171512]">
                    <img
                      src={bannerImage}
                      alt="Détail d'un univers de création"
                      className="aspect-[3/4] w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-gray-600">
                    01 — Matière & geste
                  </figcaption>
                </figure>
                <figure>
                  <div className="overflow-hidden border border-gray-300 bg-gray-200 shadow-[6px_6px_0_#171512]">
                    <img
                      src={bannerArticle}
                      alt="Composition éditoriale de mode"
                      className="aspect-[3/4] w-full object-cover object-center transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-3 text-[9px] font-bold uppercase tracking-[0.16em] text-gray-600">
                    02 — Identité & vision
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            CE QUE VOUS TROUVEZ — Triptyque éditoriale à grandes images
        =================================================================== */}
      <section className="relative bg-white py-16 md:py-24 px-6 md:px-12 border-b border-gray-300 overflow-hidden">
  <AfricanMotif
    className="pointer-events-none absolute left-0 top-20 hidden h-40 w-8 opacity-30 md:block"
    color="#B85C38"
  />
  <AfricanMotif
    className="pointer-events-none absolute right-0 bottom-20 hidden h-40 w-8 opacity-30 md:block"
    color="#642B75"
  />

  <div className="relative max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-14 md:mb-20 items-end">
      <div className="md:col-span-7">
        <EditorialLabel prefix="N°05" text="Explorer" />
        <h2 className="impact text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.85] tracking-tight text-black">
          Ce que vous<br />
          <span className="text-gray-300">trouvez ici.</span>
        </h2>
      </div>
      <div className="md:col-span-4 md:col-start-9">
        <p className="text-sm text-gray-500 leading-relaxed border-l border-gray-300 pl-5">
          Un répertoire et un espace éditorial pour explorer la richesse de la création africaine et de sa diaspora.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {[
        // 🎯 Carte 1 : Redirige vers Global Index
        { 
          to: '/creators', 
          num: '01', 
          title: 'Global Index', 
          desc: 'Découvrez les créateurs, les parcours et les talents qui font la création africaine.', 
          tag: 'Créateurs', 
          image: bannerMode, 
          color: '#B85C38' 
        },
        // 🎯 Carte 2 : Redirige vers Immersion
        { 
          to: '/immersion', 
          num: '02', 
          title: 'Immersion', 
          desc: 'Explorez les boutiques, les ateliers et les lieux physiques où la création prend vie.', 
          tag: 'Lieux', 
          image: bannerArticle, 
          color: '#642B75' 
        },
        // 🎯 Carte 3 : Redirige vers Resource Library
        { 
          to: '/resources', 
          num: '03', 
          title: 'Resource Library', 
          desc: 'Plongez dans nos articles, archives et documentations culturelles.', 
          tag: 'Savoirs', 
          image: bannerImage, 
          color: '#7C432B' 
        },
      ].map((item) => (
        <CategoryCard key={item.to} {...item} />
      ))}
    </div>
  </div>
</section>

        {/* ===================================================================
            MARQUEE — défilement éditorial
        =================================================================== */}
        <Marquee items={['Découvrir', 'Comprendre', 'Valoriser', 'Partager']} />

        {/* ===================================================================
            ENGAGEMENT — Page de magazine "vieux papier"
        =================================================================== */}
        <section className="relative bg-[#E8E2D5] px-4 py-16 md:px-8 md:py-24 overflow-hidden flex justify-center">
          {/* Conteneur principal façon page de papier */}
          <div 
            className="relative w-full max-w-[1000px] bg-[#F6F3EC] p-8 sm:p-12 md:p-16 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E"), radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.04) 100%)`,
              backgroundBlendMode: 'multiply'
            }}
          >
            {/* Ligne de marge intérieure subtile (comme un vieux livre) */}
            <div className="absolute inset-3 border border-black/5 pointer-events-none" />

            {/* En-tête éditorial */}
            <div className="mb-12 flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4 text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
              <span>Africa Global / Notes éditoriales</span>
              <span>Création · Culture · Diaspora</span>
            </div>

            {/* Titre */}
            <EditorialLabel prefix="N°06" text="Notre engagement" />
            <h2 className="mb-10 max-w-3xl impact text-4xl uppercase leading-[0.96] tracking-tight text-black sm:text-5xl md:text-6xl">
              Plus qu'une plateforme,<br />une nouvelle perspective.
            </h2>

            {/* Corps de texte en 2 colonnes */}
            <div className="grid grid-cols-1 gap-10 text-sm leading-7 text-gray-700 md:grid-cols-2 md:gap-14 md:text-base md:leading-8 text-justify">
              <div>
                <p className="mb-6 first-letter:float-left first-letter:mr-3 first-letter:font-['Playfair_Display'] first-letter:text-7xl first-letter:leading-[0.8] first-letter:text-[#B85C38]">
                  Nous ne voulons pas simplement montrer des créations. Nous voulons mettre en lumière les personnes, les idées, les cultures et les histoires qui leur donnent vie.
                </p>
                <p>
                  Des ateliers indépendants aux marques reconnues, chaque univers possède son langage. Le rôle d'Africa Global est d'ouvrir des portes vers ces univers et de faciliter leur découverte.
                </p>
              </div>
              <div className="flex flex-col">
                <p className="mb-6">
                  Nous souhaitons construire un espace attentif à la diversité des pratiques, des héritages et des nouvelles expressions créatives, sans enfermer la création africaine dans une image unique.
                </p>
                <blockquote className="mt-auto border-l-2 border-[#B85C38] py-2 pl-5 font-['Playfair_Display'] text-2xl italic leading-snug text-black sm:text-3xl">
                  « Chaque création porte une histoire. À nous de lui donner l'espace d'être découverte. »
                </blockquote>
              </div>
            </div>

            {/* Pied de page */}
            <div className="mt-12 flex items-center justify-between border-t border-black/10 pt-4 text-[9px] font-bold uppercase tracking-[0.18em] text-gray-500">
              <span>La rédaction Africa Global</span>
              <span>Discover African Creativity</span>
            </div>

            {/* Numéro de page (effet magazine) */}
            <div className="absolute bottom-6 right-8 text-[10px] font-bold text-gray-400 font-mono">
              06
            </div>
          </div>
        </section>
      </main>
    </>
  );
}