// src/components/admin/AdminTable.jsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AdminFilters from './AdminFilters';
import { useState } from 'react';

export default function AdminTable({
  columns,
  data,
  loading,
  meta,
  onPageChange,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Rechercher...',
  statusFilter = '',
  onStatusFilterChange,
}) {
  return (
    <div className="bg-white border border-black/10 overflow-hidden shadow-sm">
      {/* Filtres */}
      {onSearchChange && (
        <AdminFilters
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusChange={onStatusFilterChange}
        />
      )}

      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-black/10 text-[10px] uppercase tracking-widest text-gray-500">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="p-4 font-bold">{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-gray-500">
                <div className="flex justify-center items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#B85C38] border-t-transparent rounded-full animate-spin" />
                  Chargement...
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-12 text-center text-gray-500">
                <p className="text-lg font-['Playfair_Display'] italic mb-1">Aucun résultat trouvé</p>
                <p className="text-xs uppercase tracking-widest">Essayez de modifier votre recherche.</p>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="border-b border-black/5 hover:bg-gray-50 transition-colors">
                {columns.map((col, j) => (
                  <td key={j} className="p-4">{col.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ✅ Pagination — TOUJOURS VISIBLE si meta existe */}
      {meta && meta.last_page >= 1 && (
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-black/10 bg-gray-50">
          <span className="text-xs text-gray-500">
            Affichage de{' '}
            <strong className="text-black">
              {meta.total === 0 ? 0 : (meta.current_page - 1) * meta.per_page + 1}
            </strong>{' '}
            à{' '}
            <strong className="text-black">
              {Math.min(meta.current_page * meta.per_page, meta.total)}
            </strong>{' '}
            sur <strong className="text-black">{meta.total}</strong> résultats
          </span>

          {meta.last_page > 1 && (
            <div className="flex gap-2">
              <button
                disabled={meta.current_page === 1}
                onClick={() => onPageChange(meta.current_page - 1)}
                className="px-4 py-2 border border-black/20 text-xs font-bold uppercase tracking-widest disabled:opacity-30 hover:border-[#B85C38] hover:text-[#B85C38] transition-colors"
              >
                <ChevronLeft size={14} className="inline" /> Précédent
              </button>
              <div className="flex items-center px-3 text-xs font-bold text-gray-500">
                {meta.current_page} / {meta.last_page}
              </div>
              <button
                disabled={meta.current_page === meta.last_page}
                onClick={() => onPageChange(meta.current_page + 1)}
                className="px-4 py-2 border border-black/20 text-xs font-bold uppercase tracking-widest disabled:opacity-30 hover:border-[#B85C38] hover:text-[#B85C38] transition-colors"
              >
                Suivant <ChevronRight size={14} className="inline" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}