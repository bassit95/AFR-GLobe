import { Globe2, MapPin } from 'lucide-react';

export default function CountrySidebar({ countries, selectedCountry, onCountryChange }) {
  return (
    <aside className="w-full flex-shrink-0 lg:w-64">
      <div className="sticky top-28 border border-black/10 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 border-b border-black/10 pb-3">
          <Globe2 size={16} className="text-[#9C4A2A]" />
          <h3 className="text-[11px] font-bold uppercase tracking-[0.15em]">Pays d'origine</h3>
        </div>
        <div className="flex max-h-[60vh] flex-col gap-1.5 overflow-y-auto pr-2">
          <button
            onClick={() => onCountryChange('ALL')}
            className={`flex w-full items-center gap-3 px-3 py-2 text-left text-xs ${selectedCountry === 'ALL' ? 'bg-[#2E1B20] font-bold text-white' : 'text-black/70 hover:bg-[#F4F1EA]'}`}
          >
            <span className="flex h-4 w-5 items-center justify-center bg-gray-300 text-[8px] font-bold text-gray-500">ALL</span>
            Tous les pays
          </button>
          {countries.map((country) => {
            const flagUrl = country.code ? `https://flagcdn.com/24x18/${country.code.toLowerCase()}.png` : null;
            return (
              <button
                key={country.id}
                onClick={() => onCountryChange(country.id)}
                className={`flex w-full items-center gap-3 px-3 py-2 text-left text-xs ${selectedCountry === country.id ? 'bg-[#2E1B20] font-bold text-white' : 'text-black/70 hover:bg-[#F4F1EA]'}`}
              >
                {flagUrl ? (
                  <img src={flagUrl} alt={country.name} className="h-4 w-5 border border-black/10 object-cover" />
                ) : (
                  <span className="flex h-4 w-5 items-center justify-center border border-black/10 bg-gray-200"><MapPin size={8} /></span>
                )}
                <span className="truncate">{country.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}