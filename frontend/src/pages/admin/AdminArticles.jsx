import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useArticles from '@/hooks/useArticles';
import { deleteArticle } from '@/services/articleService';
import AdminTable from '@/components/admin/AdminTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRowActions from '@/components/admin/AdminRowActions';
import StatusBadge from '@/components/admin/StatusBadge';
import toast from 'react-hot-toast';

export default function AdminArticles() {
  const {
    data: articles, loading, error, meta, setPage, refetch,
    searchInput, setSearchInput,
  } = useArticles({ extraFilters: { status: 'all' } });

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Supprimer l'article "${title}" ?`)) return;
    try {
      await deleteArticle(id);  // ⚠️ Article = ID (pas de getRouteKeyName)
      toast.success('Article supprimé');
      refetch();
    } catch {
      toast.error('Erreur lors de la suppression');
    }
  };

  const columns = [
    {
      header: 'Titre',
      render: (a) => (
        <Link to={`/admin/articles/${a.slug}/edit`} className="font-medium hover:text-[#B85C38]">
          {a.title}
        </Link>
      ),
    },
    {
      header: 'Type',
      render: (a) => <span className="text-sm text-gray-600 capitalize">{a.article_type || '—'}</span>,
    },
    { header: 'Statut', render: (a) => <StatusBadge status={a.status} /> },
    {
      header: 'Actions',
      render: (a) => (
        <AdminRowActions
          publicUrl={`/resources/${a.slug}`}
          editUrl={`/admin/articles/${a.slug}/edit`}
          status={a.status}
          onDelete={() => handleDelete(a.id, a.title)}
        />
      ),
    },
  ];

  if (error) return <div className="text-red-500">Erreur : {error.message}</div>;

  return (
    <div>
      <AdminPageHeader
        title="Articles"
        description="Gérez les articles éditoriaux et publications."
        breadcrumbs={[{ label: 'Contenu' }, { label: 'Articles' }]}
        actions={
          <Link
            to="/admin/articles/create"
            className="flex items-center gap-2 bg-[#2E1B20] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38]"
          >
            <Plus size={16} /> Nouvel Article
          </Link>
        }
      />
      <AdminTable
        columns={columns}
        data={articles}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Rechercher un article..."
      />
    </div>
  );
}