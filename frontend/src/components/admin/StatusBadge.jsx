// src/components/admin/StatusBadge.jsx
const COLORS = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-gray-100 text-gray-600',
};

export default function StatusBadge({ status }) {
  const cls = COLORS[status] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full ${cls}`}>
      {status || 'draft'}
    </span>
  );
}