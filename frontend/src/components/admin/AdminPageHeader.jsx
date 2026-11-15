// src/components/admin/AdminPageHeader.jsx
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function AdminPageHeader({
  title,
  description,
  breadcrumbs = [],   // [{ label, to? }]
  actions,            // JSX pour boutons
}) {
  return (
    <div className="mb-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400 mb-3">
        <Link to="/admin/dashboard" className="hover:text-[#B85C38] transition-colors">
          <Home size={11} />
        </Link>
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-2">
            <ChevronRight size={10} />
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-[#B85C38] transition-colors">
                {crumb.label}
              </Link>
            ) : (
              <span className="text-gray-600">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Titre + actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-['Playfair_Display'] mb-1">{title}</h1>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}