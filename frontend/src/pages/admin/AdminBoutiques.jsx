import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useBoutiques from '@/hooks/useBoutiques';
import { deleteBoutique } from '@/services/boutiqueService';
import AdminTable from '@/components/admin/AdminTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRowActions from '@/components/admin/AdminRowActions';
import StatusBadge from '@/components/admin/StatusBadge';
import toast from 'react-hot-toast';

export default function AdminBoutiques() {
  const {
    data: boutiques, loading, error, meta, setPage, refetch,
    searchInput, setSearchInput,
  } = useBoutiques({ extraFilters: { status: 'all' } });

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer la boutique "${name}" ?`)) return;
    try {
      await deleteBoutique(id);  // ⚠️ Boutique = ID (pas de getRouteKeyName)
      toast.success('Boutique supprimée');
      refetch();
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  const columns = [
    {
      header: 'Nom',
      render: (b) => (
        <Link to={`/admin/boutiques/${b.id}/edit`} className="font-medium hover:text-[#B85C38]">
          {b.name}
        </Link>
      ),
    },
    { header: 'Marque', render: (b) => <span className="text-sm text-gray-600">{b.brand?.name || '-'}</span> },
    { header: 'Ville', render: (b) => <span className="text-sm text-gray-600">{b.city?.name || '-'}</span> },
    { header: 'Statut', render: (b) => <StatusBadge status={b.status} /> },
    {
      header: 'Actions',
      render: (b) => (
        <AdminRowActions
          publicUrl={`/boutiques/${b.id}`}
          editUrl={`/admin/boutiques/${b.id}/edit`}
          status={b.status}
          onDelete={() => handleDelete(b.id, b.name)}
        />
      ),
    },
  ];

  if (error) return <div className="text-red-500">Erreur : {error.message}</div>;

  return (
    <div>
      <AdminPageHeader
        title="Boutiques"
        description="Gérez les points de vente physiques et en ligne."
        breadcrumbs={[{ label: 'Catalogue' }, { label: 'Boutiques' }]}
        actions={
          <Link
            to="/admin/boutiques/create"
            className="flex items-center gap-2 bg-[#2E1B20] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38]"
          >
            <Plus size={16} /> Nouvelle Boutique
          </Link>
        }
      />
      <AdminTable
        columns={columns}
        data={boutiques}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Rechercher une boutique..."
      />
    </div>
  );
}