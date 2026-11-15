import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useCategories from '@/hooks/useCategories';  // ⚠️ à créer si absent
import { deleteCategory } from '@/services/catalogService';
import AdminTable from '@/components/admin/AdminTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRowActions from '@/components/admin/AdminRowActions';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const {
    data: categories, loading, error, meta, setPage, refetch,
    searchInput, setSearchInput,
  } = useCategories();

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer la catégorie "${name}" ?`)) return;
    try {
      await deleteCategory(id);
      toast.success('Catégorie supprimée');
      refetch();
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  const columns = [
    {
      header: 'Nom',
      render: (c) => (
        <Link to={`/admin/categories/${c.id}/edit`} className="font-medium hover:text-[#B85C38]">
          {c.name}
        </Link>
      ),
    },
    { header: 'Slug', render: (c) => <span className="text-sm text-gray-600 font-mono">{c.slug}</span> },
    {
      header: 'Actions',
      render: (c) => (
        <AdminRowActions
          editUrl={`/admin/categories/${c.id}/edit`}
          onDelete={() => handleDelete(c.id, c.name)}
        />
      ),
    },
  ];

  if (error) return <div className="text-red-500">Erreur : {error.message}</div>;

  return (
    <div>
      <AdminPageHeader
        title="Catégories"
        description="Gérez les catégories de produits et de créateurs."
        breadcrumbs={[{ label: 'Taxonomies' }, { label: 'Catégories' }]}
        actions={
          <Link
            to="/admin/categories/create"
            className="flex items-center gap-2 bg-[#2E1B20] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38]"
          >
            <Plus size={16} /> Nouvelle Catégorie
          </Link>
        }
      />
      <AdminTable
        columns={columns}
        data={categories}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Rechercher une catégorie..."
      />
    </div>
  );
}