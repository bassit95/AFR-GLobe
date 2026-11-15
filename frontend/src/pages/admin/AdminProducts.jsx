import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useProducts from '@/hooks/useProducts';
import { deleteProduct } from '@/services/productService';
import AdminTable from '@/components/admin/AdminTable';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminRowActions from '@/components/admin/AdminRowActions';
import StatusBadge from '@/components/admin/StatusBadge';
import { formatPrice } from '@/utils/formatters';
import toast from 'react-hot-toast';

export default function AdminProducts() {
  const {
    data: products, loading, error, meta, setPage, refetch,
    searchInput, setSearchInput,
  } = useProducts({ extraFilters: { status: 'all' } });

  const handleDelete = async (slug, name) => {
    if (!window.confirm(`Supprimer le produit "${name}" ?`)) return;
    try {
      await deleteProduct(slug);
      toast.success('Produit supprimé');
      refetch();
    } catch {
      toast.error('Erreur de suppression');
    }
  };

  const columns = [
    {
      header: 'Nom',
      render: (p) => (
        <Link to={`/admin/products/${p.slug}/edit`} className="font-medium hover:text-[#B85C38]">
          {p.name}
        </Link>
      ),
    },
    { header: 'Marque', render: (p) => <span className="text-sm text-gray-600">{p.brand?.name || '-'}</span> },
    { header: 'Prix', render: (p) => <span className="text-sm">{formatPrice(p.price, p.currency)}</span> },
    { header: 'Statut', render: (p) => <StatusBadge status={p.status} /> },
    {
      header: 'Actions',
      render: (p) => (
        <AdminRowActions
          publicUrl={`/produits/${p.slug}`}
          editUrl={`/admin/products/${p.slug}/edit`}
          status={p.status}
          onDelete={() => handleDelete(p.slug, p.name)}
        />
      ),
    },
  ];

  if (error) return <div className="text-red-500">Erreur : {error.message}</div>;

  return (
    <div>
      <AdminPageHeader
        title="Produits"
        description="Gérez le catalogue produits."
        breadcrumbs={[{ label: 'Catalogue' }, { label: 'Produits' }]}
        actions={
          <Link
            to="/admin/products/create"
            className="flex items-center gap-2 bg-[#2E1B20] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38]"
          >
            <Plus size={16} /> Nouveau Produit
          </Link>
        }
      />
      <AdminTable
        columns={columns}
        data={products}
        loading={loading}
        meta={meta}
        onPageChange={setPage}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
        searchPlaceholder="Rechercher un produit..."
      />
    </div>
  );
}