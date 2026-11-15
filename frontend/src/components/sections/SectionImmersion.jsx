// src/components/sections/SectionImmersion.jsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import AfricanMotif from '../ui/AfricanMotif';
import EditorialLabel from '../ui/EditorialLabel';
import MainBtn from '../ui/button/MainBtn';

gsap.registerPlugin(ScrollTrigger);

import immersionImage from '/images/home/immersion-03.png';

function SectionImmersion() {
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
    // ✅ Fix : py-20 md:py-32 py-16 md:py-24 → py-20 md:py-32
    <section
      ref={sectionRef}
      className="relative bg-[#F9F8F6] py-20 md:py-32 px-6 md:px-12 overflow-hidden border-b border-gray-300"
    >
      <div className="bg-text-parallax absolute top-0 left-[-5%] text-[35vw] leading-none text-black/[0.03] select-none pointer-events-none impact uppercase z-0">
        IMMERSION
      </div>

      <AfricanMotif className="absolute left-0 top-20 h-64 w-8 opacity-20 hidden md:block z-0" color="#B85C38" />
      <AfricanMotif className="absolute right-0 bottom-20 h-64 w-8 opacity-20 hidden md:block z-0" color="#642B75" />

      <div className="relative z-10 max-w-[1300px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="md:col-span-7 relative order-1 md:order-1">
          <div className="absolute -top-4 -left-4 md:-top-8 md:-left-8 w-full h-full bg-[#B85C38] z-0" />

          <div className="relative z-10 aspect-[4/3] md:aspect-[16/10] overflow-hidden border border-gray-300 bg-gray-200">
            <img
              src={immersionImage}
              alt="Immersion Africa Global"
              className="w-full h-full object-cover object-center grayscale-[30%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <AfricanMotif className="absolute bottom-6 left-6 h-20 w-6 opacity-80" color="#D4A84B" />
            <div className="absolute bottom-6 right-6 flex items-center gap-3">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] bg-white text-black px-3 py-1.5">
                Expérience
              </span>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                Vision · Vol. 04
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 relative order-2 md:order-2">
          <EditorialLabel prefix="N°04" text="Le Manifeste" />

          <h2 className="impact text-5xl md:text-6xl lg:text-7xl uppercase leading-[0.85] tracking-tight text-black mb-8">
            Plongez dans<br />
            <span className="text-gray-300">l'univers.</span>
          </h2>

          <p className="font-['Playfair_Display'] text-lg md:text-xl italic leading-snug text-[#2E1B20] border-l-2 border-[#B85C38] pl-5 mb-8">
            « Venez découvrir chez nos créateurs une vision profonde et unique de la mode africaine contemporaine. »
          </p>

          <p className="text-sm md:text-base text-gray-600 leading-relaxed text-justify mb-10">
            Africa Global est un engagement envers la préservation des savoir-faire patrimoniaux, la mise en avant de l'avant-garde créative africaine et la construction d'un réseau culturel mondial interconnecté. Immergez-vous dans les histoires et les textures.
          </p>

          <MainBtn
            path="/immersion"
            text="Entrer dans l'immersion"
            variant="primary"
            className="bg-[#000000]! text-white! hover:bg-[#B85C38]!"
          />
        </div>
      </div>
    </section>
  );
}

export default SectionImmersion;