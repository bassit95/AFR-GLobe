import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useBrands from '@/hooks/useBrands';
import { deleteBrand } from '@/services/brandService';
import AdminTable from '@/components/admin/AdminTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRowActions from '@/components/admin/AdminRowActions';
import StatusBadge from '@/components/admin/StatusBadge';
import toast from 'react-hot-toast';

export default function AdminBrands() {
  const {
    data: brands, loading, error, meta, setPage, refetch,
    searchInput, setSearchInput,
  } = useBrands({ extraFilters: { status: 'all' } });

  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Supprimer la marque "${name}" ?`)) return;
    try {
      await deleteBrand(slug);
      toast.success('Marque supprimée');
      refetch();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      header: 'Nom',
      render: (b) => (
        <Link to={`/admin/brands/${b.slug}/edit`} className="font-medium hover:text-[#B85C38]">
          {b.name}
        </Link>
      ),
    },
    { header: 'Statut', render: (b) => <StatusBadge status={b.status} /> },
    { header: 'Pays', render: (b) => <span className="text-sm text-gray-600">{b.country?.name || '-'}</span> },
    {
      header: 'Actions',
      render: (b) => (
        <AdminRowActions
          publicUrl={`/marques/${b.slug}`}
          editUrl={`/admin/brands/${b.slug}/edit`}
          status={b.status}
          onDelete={() => handleDelete(b.slug, b.name)}
        />
      ),
    },
  ];

  if (error) return <div className="text-red-500">Erreur : {error.message}</div>;

  return (
    <div>
      <AdminPageHeader
        title="Marques"
        description="Gérez les marques du répertoire Africa Global."
        breadcrumbs={[{ label: 'Contenu' }, { label: 'Marques' }]}
        actions={
          <Link
            to="/admin/brands/create"
            className="flex items-center gap-2 bg-[#2E1B20] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38]"
          >
            <Plus size={16} /> Nouvelle Marque
          </Link>
        }
      />

      <AdminTable
        columns={columns}
        data={brands}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Rechercher une marque..."
      />
    </div>
  );
}