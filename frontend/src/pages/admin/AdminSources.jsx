import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useSources from '@/hooks/useSources';
import { deleteSource } from '@/services/sourceService';
import AdminTable from '@/components/admin/AdminTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRowActions from '@/components/admin/AdminRowActions';
import toast from 'react-hot-toast';

export default function AdminSources() {
  const {
    data: sources, loading, error, meta, setPage, refetch,
    searchInput, setSearchInput,
  } = useSources();

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Supprimer la source "${title}" ?`)) return;
    try {
      await deleteSource(id);
      toast.success('Source supprimée');
      refetch();
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  const columns = [
    {
      header: 'Titre',
      render: (s) => (
        <Link to={`/admin/sources/${s.id}/edit`} className="font-medium hover:text-[#B85C38]">
          {s.title}
        </Link>
      ),
    },
    { header: 'Type', render: (s) => <span className="text-sm text-gray-600">{s.source_type}</span> },
    { header: 'Éditeur', render: (s) => <span className="text-sm text-gray-600">{s.publisher || '—'}</span> },
    {
      header: 'Actions',
      render: (s) => (
        <AdminRowActions
          editUrl={`/admin/sources/${s.id}/edit`}
          onDelete={() => handleDelete(s.id, s.title)}
        />
      ),
    },
  ];

  if (error) return <div className="text-red-500">Erreur : {error.message}</div>;

  return (
    <div>
      <AdminPageHeader
        title="Sources & Bibliographie"
        description="Gérez les sources documentaires et références."
        breadcrumbs={[{ label: 'Contenu' }, { label: 'Sources' }]}
        actions={
          <Link
            to="/admin/sources/create"
            className="flex items-center gap-2 bg-[#2E1B20] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38]"
          >
            <Plus size={16} /> Nouvelle Source
          </Link>
        }
      />
      <AdminTable
        columns={columns}
        data={sources}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Rechercher une source..."
      />
    </div>
  );
}