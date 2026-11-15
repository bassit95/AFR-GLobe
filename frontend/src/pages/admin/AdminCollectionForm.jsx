import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { fetchCollectionBySlug, createCollection, updateCollection } from '@/services/collectionService';
import { fetchBrands } from '@/services/brandService';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

export default function AdminCollectionForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { status: 'published' },
  });

  useEffect(() => {
    fetchBrands({ perPage: 100 }).then((r) => setBrands(r.data || []));
    if (isEdit) {
      fetchCollectionBySlug(slug).then((r) => { reset(r.data); setLoading(false); })
        .catch(() => { toast.error('Impossible de charger la collection'); navigate('/admin/collections'); });
    }
  }, [slug, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) await updateCollection(slug, data);
      else await createCollection(data);
      toast.success(isEdit ? 'Collection mise à jour !' : 'Collection créée !');
      navigate('/admin/collections');
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
    <div className="max-w-3xl">
      <AdminPageHeader
        title={isEdit ? 'Modifier la Collection' : 'Nouvelle Collection'}
        description={isEdit ? `Édition de "${slug}"` : 'Créer une nouvelle collection.'}
        breadcrumbs={[
          { label: 'Collections', to: '/admin/collections' },
          { label: isEdit ? 'Modifier' : 'Nouvelle' },
        ]}
        actions={
          <button type="button" onClick={() => navigate('/admin/collections')}
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
              <option value="">Sélectionner une marque</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Nom *</label>
            <input {...register('name', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Slug *</label>
            <input {...register('slug', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Année</label>
            <input type="number" {...register('year')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Saison</label>
            <input {...register('season')} placeholder="Spring/Summer" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Description</label>
          <textarea {...register('description')} rows="4" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Image de couverture (URL)</label>
          <input {...register('cover_image')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
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