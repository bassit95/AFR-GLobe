// src/components/layout/MainLayout.jsx
import React, { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from '@/components/layout/Navbar/Navbar';
import Footer from '@/components/layout/Footer/Footer';

// 🎯 Vérifie bien ces 2 imports
import ScrollToTop from '@/components/ui/ScrollToTop'; // Ton bouton flottant
import ScrollRestoration from '@/components/ui/ScrollRestoration'; // Le reset invisible
import SearchCommandPalette from '@/components/ui/SearchCommandPalette';
gsap.registerPlugin(ScrollTrigger);

export default function MainLayout() {
  const mainRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1A1A1A]">
      {/* 🎯 On place le reset invisible ici */}
      <ScrollRestoration /> 

      <Navbar />
      <SearchCommandPalette /> {/* 🎯 Ajout ici */}
      <main className="flex-grow w-full overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
      
      {/* 🎯 Et le bouton flottant ici */}
      <ScrollToTop />
    </div>
  );
}