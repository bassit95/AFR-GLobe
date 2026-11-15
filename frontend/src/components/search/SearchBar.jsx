// src/components/search/SearchBar.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MousePointerClick } from 'lucide-react';

export default function SearchBar({ initialQuery = '', placeholder = "Rechercher un créateur, une marque..." }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-3xl mx-auto group"
    >
      {/* Ombre portée douce derrière la barre */}
      <div className="absolute inset-0 bg-black/10 blur-xl rounded-full transform translate-y-2 scale-95 group-hover:scale-100 transition-transform duration-500" />
      
      {/* La barre de recherche */}
      <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl border border-gray-100">
        
        {/* Icône de recherche (Gauche) */}
        <div className="flex items-center justify-center w-14 h-14 bg-[#D4A84B] rounded-full text-white shrink-0 shadow-md">
          <Search size={24} strokeWidth={2.5} />
        </div>

        {/* Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-6 text-lg md:text-xl text-[#1A1A1A] outline-none placeholder:text-gray-400 font-['Inter']"
        />

        {/* Icône d'interaction (Droite) */}
        <div className="flex items-center justify-center w-14 h-14 text-[#D4A84B] shrink-0 animate-pulse">
          <MousePointerClick size={28} strokeWidth={1.5} />
        </div>
      </div>
    </form>
  );
}