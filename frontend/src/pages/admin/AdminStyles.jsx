import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useStyles from '@/hooks/useStyles';  // ⚠️ à créer si absent
import { deleteStyle } from '@/services/catalogService';
import AdminTable from '@/components/admin/AdminTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRowActions from '@/components/admin/AdminRowActions';
import toast from 'react-hot-toast';

export default function AdminStyles() {
  const {
    data: styles, loading, error, meta, setPage, refetch,
    searchInput, setSearchInput,
  } = useStyles();

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer le style "${name}" ?`)) return;
    try {
      await deleteStyle(id);
      toast.success('Style supprimé');
      refetch();
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  const columns = [
    {
      header: 'Nom',
      render: (s) => (
        <Link to={`/admin/styles/${s.id}/edit`} className="font-medium hover:text-[#B85C38]">
          {s.name}
        </Link>
      ),
    },
    { header: 'Parent', render: (s) => <span className="text-sm text-gray-600">{s.parent?.name || '—'}</span> },
    { header: 'Slug', render: (s) => <span className="text-sm text-gray-600 font-mono">{s.slug}</span> },
    {
      header: 'Actions',
      render: (s) => (
        <AdminRowActions
          editUrl={`/admin/styles/${s.id}/edit`}
          onDelete={() => handleDelete(s.id, s.name)}
        />
      ),
    },
  ];

  if (error) return <div className="text-red-500">Erreur : {error.message}</div>;

  return (
    <div>
      <AdminPageHeader
        title="Styles"
        description="Gérez la hiérarchie des styles et esthétiques."
        breadcrumbs={[{ label: 'Taxonomies' }, { label: 'Styles' }]}
        actions={
          <Link
            to="/admin/styles/create"
            className="flex items-center gap-2 bg-[#2E1B20] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38]"
          >
            <Plus size={16} /> Nouveau Style
          </Link>
        }
      />
      <AdminTable
        columns={columns}
        data={styles}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Rechercher un style..."
      />
    </div>
  );
}