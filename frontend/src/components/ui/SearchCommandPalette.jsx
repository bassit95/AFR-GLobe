// src/components/ui/SearchCommandPalette.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, Tag, FileText, Layers, ShoppingBag } from 'lucide-react';
import  useSearch  from '@/hooks/useSearch';
import { imageUrl } from '@/utils/image';

const ICONS = {
  creators: User,
  brands: Tag,
  articles: FileText,
  collections: Layers,
  products: ShoppingBag,
};

export default function SearchCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { results, loading, isReady } = useSearch(query);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // 🎯 Gestion de l'ouverture via Cmd+K / Ctrl+K et de la fermeture via Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus sur l'input à l'ouverture
  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNavigate = (path) => {
    setIsOpen(false);
    setQuery('');
    navigate(path);
  };

  const renderSection = (type, items) => {
    if (!items || items.length === 0) return null;
    const Icon = ICONS[type];

    return (
      <div className="mb-6">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 px-4">{type}</h3>
        {items.map((item) => {
          let path = '#';
          if (type === 'creators') path = `/creators/${item.slug}`;
          if (type === 'brands') path = `/marques/${item.slug}`;
          if (type === 'articles') path = `/resources/${item.slug}`;
          if (type === 'collections') path = `/collections/${item.slug || item.id}`;
          if (type === 'products') path = `/produits/${item.slug || item.id}`;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(path)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F4F1EA] transition-colors text-left"
            >
              <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden flex-shrink-0">
                {item.profile_image || item.cover_image || item.image ? (
                  <img src={imageUrl(item.profile_image || item.cover_image || item.image)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Icon size={16} className="m-auto mt-2 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1A1A1A] truncate">{item.name || item.title}</p>
                {type === 'collections' && item.brand && (
                  <p className="text-xs text-gray-500 truncate">{item.brand.name}</p>
                )}
              </div>
              <Icon size={14} className="text-gray-400" />
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/40 backdrop-blur-sm">
      {/* Overlay cliquable pour fermer */}
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

      {/* Fenêtre de recherche */}
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden border border-black/10">
        
        {/* Barre de saisie */}
        <div className="flex items-center px-4 py-4 border-b border-black/10">
          <Search size={20} className="text-[#B85C38]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un créateur, une marque, un article..."
            className="flex-1 bg-transparent px-4 text-lg outline-none placeholder:text-gray-400"
          />
          <button onClick={() => setIsOpen(false)} className="p-1 text-gray-400 hover:text-black">
            <X size={18} />
          </button>
        </div>

        {/* Résultats */}
        <div className="max-h-[60vh] overflow-y-auto py-4">
          {!isReady && (
            <p className="text-center text-sm text-gray-400 py-8">Tapez au moins 2 caractères...</p>
          )}
          
          {isReady && loading && (
            <p className="text-center text-sm text-[#B85C38] py-8">Recherche en cours...</p>
          )}

          {isReady && !loading && results && (
            <>
              {renderSection('creators', results.creators)}
              {renderSection('brands', results.brands)}
              {renderSection('articles', results.articles)}
              {renderSection('collections', results.collections)}
              {renderSection('products', results.products)}
              
              {Object.values(results).every(arr => !arr || arr.length === 0) && (
                <p className="text-center text-sm text-gray-500 py-8">Aucun résultat pour "{query}"</p>
              )}
            </>
          )}
        </div>
        
        {/* Footer raccourcis */}
        <div className="bg-gray-50 px-4 py-2 border-t border-black/10 flex justify-end gap-4 text-[10px] text-gray-500 font-bold uppercase">
          <span><kbd className="bg-white border px-1 rounded">Esc</kbd> Fermer</span>
          <span><kbd className="bg-white border px-1 rounded">↵</kbd> Ouvrir</span>
        </div>
      </div>
    </div>
  );
}