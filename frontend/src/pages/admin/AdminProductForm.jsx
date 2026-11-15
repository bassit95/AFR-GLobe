import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { fetchProductBySlug, createProduct, updateProduct } from '@/services/productService';
import { fetchBrands } from '@/services/brandService';
import { fetchCategories, fetchStyles } from '@/services/catalogService';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

export default function AdminProductForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { status: 'published', availability: 'available' },
  });

  useEffect(() => {
    Promise.all([fetchBrands({ perPage: 100 }), fetchCategories({ perPage: 100 }), fetchStyles({ perPage: 100 })])
      .then(([rb, rc, rs]) => { setBrands(rb.data || []); setCategories(rc.data || []); setStyles(rs.data || []); });
    if (isEdit) {
      fetchProductBySlug(slug).then((r) => {
        const p = r.data;
        reset({
          ...p,
          brand_id: p.brand?.id,
          collection_id: p.collection?.id,
          category_ids: p.categories?.map((c) => c.id) || [],
          style_ids: p.styles?.map((s) => s.id) || [],
        });
        setLoading(false);
      }).catch(() => { toast.error('Impossible de charger le produit'); navigate('/admin/products'); });
    }
  }, [slug, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) await updateProduct(slug, data);
      else await createProduct(data);
      toast.success(isEdit ? 'Produit mis à jour !' : 'Produit créé !');
      navigate('/admin/products');
    } catch (err) {
      if (err.response?.status === 422) {
        Object.keys(err.response.data.errors).forEach((f) =>
          setError(f, { message: err.response.data.errors[f][0] })
        );
        toast.error('Veuillez corriger les erreurs.');
      } else toast.error(err.message || 'Une erreur est survenue');
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="max-w-4xl">
      <AdminPageHeader
        title={isEdit ? 'Modifier le Produit' : 'Nouveau Produit'}
        description={isEdit ? `Édition de "${slug}"` : 'Créer une nouvelle fiche produit.'}
        breadcrumbs={[
          { label: 'Produits', to: '/admin/products' },
          { label: isEdit ? 'Modifier' : 'Nouveau' },
        ]}
        actions={
          <button type="button" onClick={() => navigate('/admin/products')}
            className="flex items-center gap-2 border border-black/20 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#B85C38]">
            <ArrowLeft size={16} /> Retour
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Marque *</label>
            <select {...register('brand_id', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="">Sélectionner</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Nom du produit *</label>
            <input {...register('name', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Slug *</label>
            <input {...register('slug', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Prix</label>
              <input type="number" step="0.01" {...register('price')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Devise</label>
              <input {...register('currency')} placeholder="EUR" maxLength={3} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Description</label>
          <textarea {...register('description')} rows="3" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Image (URL)</label>
            <input {...register('image')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Lien d'achat (URL)</label>
            <input {...register('product_url')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Genre</label>
            <select {...register('gender')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="">Non spécifié</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="unisex">Unisexe</option>
              <option value="kids">Enfant</option>
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Disponibilité</label>
            <select {...register('availability')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="available">Disponible</option>
              <option value="sold_out">Épuisé</option>
              <option value="preorder">Précommande</option>
              <option value="coming_soon">Bientôt</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Catégories</label>
            <select multiple {...register('category_ids')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none h-32">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Styles</label>
            <select multiple {...register('style_ids')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none h-32">
              {styles.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Statut *</label>
          <select {...register('status', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        <div className="pt-6 border-t border-black/10 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-[#2E1B20] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38] disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}