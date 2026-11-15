// src/components/admin/AdminFilters.jsx
import { Search, Filter } from 'lucide-react';

export default function AdminFilters({
  searchValue,
  onSearchChange,
  statusFilter,
  onStatusChange,
  extraFilters,
}) {
  return (
    <div className="bg-white border border-black/10 p-4 mb-4 flex flex-wrap gap-3 items-center">
      {/* Recherche */}
      <label className="flex flex-1 min-w-[240px] items-center gap-2 border border-gray-300 px-3 py-2">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher..."
          className="flex-1 outline-none text-sm"
        />
      </label>

      {/* Filtre statut */}
      <label className="flex items-center gap-2 border border-gray-300 px-3 py-2">
        <Filter size={16} className="text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="outline-none text-sm cursor-pointer"
        >
          <option value="">Tous les statuts</option>
          <option value="published">Publiés</option>
          <option value="draft">Brouillons</option>
          <option value="archived">Archivés</option>
        </select>
      </label>

      {extraFilters}
    </div>
  );
}