// src/components/ui/ScrollRestoration.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 🎯 À chaque changement de page (pathname), on force le scroll à 0
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Invisible
}