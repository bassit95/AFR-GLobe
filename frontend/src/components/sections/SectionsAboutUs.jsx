// src/components/sections/SectionsAboutUs.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AfricanMotif from '../ui/AfricanMotif';
import EditorialLabel from '../ui/EditorialLabel';
import MainBtn from '../ui/button/MainBtn';

gsap.registerPlugin(ScrollTrigger);

const bannerHomeImage = '/images/banner/banner-02.jpeg';

function SectionAboutUs() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.bg-text-parallax', {
        yPercent: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    // ✅ Fix : déduplication py-20 md:py-32 md:py-24 → py-20 md:py-32
    <section
      ref={sectionRef}
      className="relative bg-[#F9F8F6] py-20 md:py-32 px-6 md:px-12 overflow-hidden border-b border-gray-300"
    >
      <div className="bg-text-parallax absolute top-0 left-[-5%] text-[35vw] leading-none text-black/[0.03] select-none pointer-events-none impact uppercase z-0">
        HISTOIRE
      </div>

      <AfricanMotif className="absolute left-0 top-20 h-64 w-8 opacity-20 hidden md:block z-0" color="#B85C38" />
      <AfricanMotif className="absolute right-0 bottom-20 h-64 w-8 opacity-20 hidden md:block z-0" color="#642B75" />

      <div className="relative z-10 max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="md:col-span-5 relative order-2 md:order-1">
          <EditorialLabel prefix="N°01" text="Notre histoire" />

          <h2 className="impact text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.85] tracking-tight text-black mb-8">
            L'Afrique<br />
            <span className="text-gray-300">crée.</span>
          </h2>

          <p className="font-['Playfair_Display'] text-xl md:text-2xl italic leading-snug text-[#2E1B20] border-l-2 border-[#D4A84B] pl-5 mb-8">
            « Découvrir les créateurs africains, comprendre leurs univers et faire rayonner leurs histoires. »
          </p>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed text-justify mb-10">
            Africa Global est une plateforme éditoriale et un répertoire numérique dédiés à la découverte et à la valorisation des créateurs africains et de la diaspora. Des talents émergents aux maisons établies, nous mettons en lumière les personnes, les univers et les histoires qui façonnent la création contemporaine.
          </p>

          <MainBtn
            path="/about"
            text="Découvrir notre manifeste"
            variant="primary"
            className="bg-[#000000]! text-white! hover:bg-[#D4A84B]!"
          />
        </div>

        <div className="md:col-span-7 relative order-1 md:order-2">
          <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 w-full h-full bg-[#642B75] z-0" />

          <div className="relative z-10 aspect-[4/3] md:aspect-[16/10] overflow-hidden border border-gray-300 bg-gray-200">
            <img
              src={bannerHomeImage}
              alt="Création africaine contemporaine"
              className="w-full h-full object-cover object-center grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <AfricanMotif className="absolute bottom-6 right-6 h-20 w-6 opacity-80" color="#D4A84B" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-white text-black px-3 py-1.5">
                Africa Global
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                Manifeste · Vol. 01
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SectionAboutUs;