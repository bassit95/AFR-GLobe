// src/components/admin/AdminRowActions.jsx
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, CheckCircle, EyeOff } from 'lucide-react';

/**
 * Actions standardisées pour chaque ligne admin.
 * @param {string} publicUrl - URL publique (ex: `/creators/${slug}`)
 * @param {string} editUrl - URL admin d'édition
 * @param {string} status - 'published' | 'draft' | 'archived'
 * @param {function} onDelete - callback suppression
 * @param {function} onToggleStatus - callback publish/unpublish
 */
export default function AdminRowActions({
  publicUrl,
  editUrl,
  status,
  onDelete,
  onToggleStatus,
}) {
  const isPublished = status === 'published';

  return (
    <div className="flex justify-end gap-1">
      {/* Voir sur le site public */}
      {publicUrl && (
        <a
          href={publicUrl}
          target="_blank"
          rel="noreferrer"
          className="p-2 text-gray-500 hover:text-[#B85C38] transition-colors"
          title="Voir sur le site public"
        >
          <Eye size={18} />
        </a>
      )}

      {/* Toggle statut rapide */}
      {onToggleStatus && (
        <button
          onClick={onToggleStatus}
          className={`p-2 transition-colors ${
            isPublished
              ? 'text-green-600 hover:text-yellow-600'
              : 'text-gray-400 hover:text-green-600'
          }`}
          title={isPublished ? 'Dépublier' : 'Publier'}
        >
          {isPublished ? <CheckCircle size={18} /> : <EyeOff size={18} />}
        </button>
      )}

      {/* Éditer */}
      {editUrl && (
        <Link
          to={editUrl}
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
          title="Éditer"
        >
          <Edit size={18} />
        </Link>
      )}

      {/* Supprimer */}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
          title="Supprimer"
        >
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}