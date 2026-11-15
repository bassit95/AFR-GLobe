import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, BookOpen, ArrowLeft } from 'lucide-react';
import { fetchSource, createSource, updateSource } from '@/services/sourceService';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

export default function AdminSourceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (isEdit) {
      fetchSource(id).then((r) => {
        const s = r.data;
        reset({
          ...s,
          published_at: s.published_at ? s.published_at.split('T')[0] : '',
          checked_at: s.checked_at ? s.checked_at.split('T')[0] : '',
        });
        setLoading(false);
      }).catch(() => { toast.error('Impossible de charger la source'); navigate('/admin/sources'); });
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, publisher: data.publisher || null, published_at: data.published_at || null, checked_at: data.checked_at || null };
      if (isEdit) await updateSource(id, payload);
      else await createSource(payload);
      toast.success(isEdit ? 'Source mise à jour !' : 'Source créée !');
      navigate('/admin/sources');
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
        title={isEdit ? 'Modifier la Source' : 'Nouvelle Source'}
        description={isEdit ? `Édition de la source #${id}` : 'Ajouter une nouvelle source documentaire.'}
        breadcrumbs={[
          { label: 'Sources', to: '/admin/sources' },
          { label: isEdit ? 'Modifier' : 'Nouvelle' },
        ]}
        actions={
          <button type="button" onClick={() => navigate('/admin/sources')}
            className="flex items-center gap-2 border border-black/20 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#B85C38]">
            <ArrowLeft size={16} /> Retour
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-black/10">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Titre *</label>
          <input {...register('title', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">URL *</label>
            <input {...register('url', { required: "L'URL est obligatoire", pattern: { value: /^https?:\/\/.+/i, message: 'Doit commencer par http:// ou https://' } })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" placeholder="https://..." />
            {errors.url && <p className="text-red-500 text-xs mt-1">{errors.url.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Type *</label>
            <select {...register('source_type', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="">Sélectionner</option>
              <option value="academic_review">Article scientifique</option>
              <option value="university_thesis">Thèse universitaire</option>
              <option value="official_website">Site officiel</option>
              <option value="institutional_profile">Profil institutionnel</option>
              <option value="editorial_profile">Profil éditorial</option>
              <option value="image_license">Licence image</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Éditeur</label>
          <input {...register('publisher')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 border border-gray-200">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Date de publication</label>
            <input type="date" {...register('published_at')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Date de vérification</label>
            <input type="date" {...register('checked_at')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
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