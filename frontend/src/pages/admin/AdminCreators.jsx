import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useCreators from '@/hooks/useCreators';
import { deleteCreator } from '@/services/creatorService';
import AdminTable from '@/components/admin/AdminTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRowActions from '@/components/admin/AdminRowActions';
import StatusBadge from '@/components/admin/StatusBadge';
import toast from 'react-hot-toast';

export default function AdminCreators() {
  const {
    data: creators, loading, error, meta, setPage, refetch,
    searchInput, setSearchInput,
  } = useCreators({ extraFilters: { status: 'all' } });

  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Supprimer le créateur "${name}" ?`)) return;
    try {
      await deleteCreator(slug);
      toast.success('Créateur supprimé');
      refetch();
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  const columns = [
    {
      header: 'Nom',
      render: (c) => (
        <Link to={`/admin/creators/${c.slug}/edit`} className="font-medium hover:text-[#B85C38]">
          {c.name}
        </Link>
      ),
    },
    {
      header: 'Pays',
      render: (c) => <span className="text-sm text-gray-600">{c.country_of_origin?.name || '-'}</span>,
    },
    { header: 'Statut', render: (c) => <StatusBadge status={c.status} /> },
    {
      header: 'Actions',
      render: (c) => (
        <AdminRowActions
          publicUrl={`/creators/${c.slug}`}
          editUrl={`/admin/creators/${c.slug}/edit`}
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
        title="Créateurs"
        description="Gérez les créateurs du répertoire Africa Global."
        breadcrumbs={[{ label: 'Contenu' }, { label: 'Créateurs' }]}
        actions={
          <Link
            to="/admin/creators/create"
            className="flex items-center gap-2 bg-[#2E1B20] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38]"
          >
            <Plus size={16} /> Nouveau Créateur
          </Link>
        }
      />
      <AdminTable
        columns={columns}
        data={creators}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Rechercher un créateur..."
      />
    </div>
  );
}