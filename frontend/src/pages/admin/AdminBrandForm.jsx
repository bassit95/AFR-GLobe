import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { fetchBrandBySlug, createBrand, updateBrand } from '@/services/brandService';
import { fetchCountries } from '@/services/locationService';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

export default function AdminBrandForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const { register, handleSubmit, setError, reset, control, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    fetchCountries({ perPage: 100 }).then((r) => setCountries(r.data || []));
    if (isEdit) {
      fetchBrandBySlug(slug).then((r) => { reset(r.data); setLoading(false); })
        .catch(() => { toast.error('Impossible de charger la marque'); navigate('/admin/brands'); });
    }
  }, [slug, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) await updateBrand(slug, data);
      else await createBrand(data);
      toast.success(isEdit ? 'Marque mise à jour !' : 'Marque créée !');
      navigate('/admin/brands');
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
        title={isEdit ? 'Modifier la Marque' : 'Nouvelle Marque'}
        description={isEdit ? `Édition de "${slug}"` : 'Créer une nouvelle fiche marque.'}
        breadcrumbs={[
          { label: 'Marques', to: '/admin/brands' },
          { label: isEdit ? 'Modifier' : 'Nouvelle' },
        ]}
        actions={
          <button type="button" onClick={() => navigate('/admin/brands')}
            className="flex items-center gap-2 border border-black/20 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#B85C38]">
            <ArrowLeft size={16} /> Retour
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-black/10">
        {/* ... tous les champs déjà reçus dans la V2 ... */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Nom *</label>
            <input {...register('name', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Slug *</label>
            <input {...register('slug', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
            {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Description</label>
          <textarea {...register('description')} rows="4" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Pays</label>
            <select {...register('country_id')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="">Sélectionnez un pays</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Site Web</label>
            <input {...register('website_url')} type="url" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" placeholder="https://..." />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 border border-gray-200">
          <Controller name="logo" control={control} render={({ field }) => (
            <ImageUpload label="Logo de la marque" value={field.value} onChange={field.onChange} />
          )} />
          <Controller name="cover_image" control={control} render={({ field }) => (
            <ImageUpload label="Image de couverture" value={field.value} onChange={field.onChange} />
          )} />
        </div>

        <div className="bg-[#F4F1EA] p-6 border border-black/10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#7C432B] mb-4">Optimisation SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Titre Meta</label>
              <input {...register('meta_title')} className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-[#B85C38]" maxLength={255} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Description Meta</label>
              <textarea {...register('meta_description')} rows="2" className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-[#B85C38]" maxLength={500} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Statut *</label>
          <select {...register('status', { required: 'Requis' })} defaultValue="published" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
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