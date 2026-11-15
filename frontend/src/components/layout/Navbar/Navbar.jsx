import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import NavMenu from './NavMenu';

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermeture automatique du menu mobile lors de la navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    ['Home', '/'],
    ['About us', '/about'],
    ['Global index', '/creators'],
    ['Immersion', '/immersion'],
    ['Resource library', '/resources'],
    ['Contact', '/contact'],
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white   py-4 shadow-xs'
          : 'bg-gradient-to-b from-black/70 via-black/30 to-transparent py-6 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo Éditorial Africa Global */}
        <Link to="/" className="flex flex-col">
          <span
            className={`impact text-xl sm:text-2xl tracking-wider uppercase leading-none transition-colors ${
              isScrolled ? 'text-[#1A1A1A]' : 'text-white'
            }`}
          >
            AFRICA GLOBAL
          </span>
          <span
            className={`text-[8px] tracking-[0.3em] uppercase mt-1 transition-colors ${
              isScrolled ? 'text-[#6B6B6B]' : 'text-gray-300'
            }`}
          >
            CREATIVE INDEX
          </span>
        </Link>

        {/* Liens de Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(([label, path]) => (
            <NavMenu
              key={path}
              label={label}
              path={path}
              isScrolled={isScrolled}
            />
          ))}
        </nav>

        {/* Actions : Recherche & Hamburger Mobile */}
        <div className="flex items-center space-x-4">
          <Link
            to="/search"
            className={`p-2 transition-colors ${
              isScrolled ? 'text-[#1A1A1A] hover:text-[#B85C38]' : 'text-white hover:text-[#D4A574]'
            }`}
            aria-label="Rechercher dans l'index"
          >
            <Search size={18} />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 transition-colors ${
              isScrolled ? 'text-[#1A1A1A]' : 'text-white'
            }`}
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Navigation Mobile (Drawer) */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[70px] bg-[#FAF7F2] border-b border-[#EFE8DC] p-6 shadow-xl flex flex-col space-y-4">
          {navLinks.map(([label, path]) => (
            <NavMenu
              key={path}
              label={label}
              path={path}
              isScrolled={true}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}
        </div>
      )}
    </header>
  );
}


export default Navbar;