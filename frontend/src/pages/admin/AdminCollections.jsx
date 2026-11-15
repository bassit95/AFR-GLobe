import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useCollections from '@/hooks/useCollections';
import { deleteCollection } from '@/services/collectionService';
import AdminTable from '@/components/admin/AdminTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRowActions from '@/components/admin/AdminRowActions';
import StatusBadge from '@/components/admin/StatusBadge';
import toast from 'react-hot-toast';

export default function AdminCollections() {
  const {
    data: collections, loading, error, meta, setPage, refetch,
    searchInput, setSearchInput,
  } = useCollections({ extraFilters: { status: 'all' } });

  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Supprimer la collection "${name}" ?`)) return;
    try {
      await deleteCollection(slug);
      toast.success('Collection supprimée');
      refetch();
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  const columns = [
    {
      header: 'Nom',
      render: (c) => (
        <Link to={`/admin/collections/${c.slug}/edit`} className="font-medium hover:text-[#B85C38]">
          {c.name}
        </Link>
      ),
    },
    { header: 'Marque', render: (c) => <span className="text-sm text-gray-600">{c.brand?.name || '-'}</span> },
    {
      header: 'Saison / Année',
      render: (c) => <span className="text-sm text-gray-600">{[c.season, c.year].filter(Boolean).join(' · ') || '—'}</span>,
    },
    { header: 'Statut', render: (c) => <StatusBadge status={c.status} /> },
    {
      header: 'Actions',
      render: (c) => (
        <AdminRowActions
          publicUrl={`/collections/${c.slug}`}
          editUrl={`/admin/collections/${c.slug}/edit`}
          status={c.status}
          onDelete={() => handleDelete(c.slug, c.name)}
        />
      ),
    },
  ];

  if (error) return <div className="text-red-500">Erreur : {error.message}</div>;

  return (
    <div>
      <AdminPageHeader
        title="Collections"
        description="Gérez les collections saisonnières des maisons."
        breadcrumbs={[{ label: 'Catalogue' }, { label: 'Collections' }]}
        actions={
          <Link
            to="/admin/collections/create"
            className="flex items-center gap-2 bg-[#2E1B20] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38]"
          >
            <Plus size={16} /> Nouvelle Collection
          </Link>
        }
      />
      <AdminTable
        columns={columns}
        data={collections}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Rechercher une collection..."
      />
    </div>
  );
}