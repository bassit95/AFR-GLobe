import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { fetchStyle, createStyle, updateStyle, fetchStyles } from '@/services/catalogService';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

export default function AdminStyleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [parentStyles, setParentStyles] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const { register, handleSubmit, setError, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    fetchStyles({ perPage: 100 }).then((r) => setParentStyles((r.data || []).filter((s) => !s.parent_id)));
    if (isEdit) {
      fetchStyle(id).then((r) => { reset(r.data); setLoading(false); })
        .catch(() => { toast.error('Impossible de charger'); navigate('/admin/styles'); });
    }
  }, [id, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) await updateStyle(id, data);
      else await createStyle(data);
      toast.success(isEdit ? 'Style modifié' : 'Style créé');
      navigate('/admin/styles');
    } catch (err) {
      if (err.response?.status === 422) {
        Object.keys(err.response.data.errors).forEach((f) =>
          setError(f, { message: err.response.data.errors[f][0] })
        );
        toast.error('Veuillez corriger les erreurs.');
      } else toast.error(err.message || 'Erreur');
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title={isEdit ? 'Modifier le Style' : 'Nouveau Style'}
        description={isEdit ? `Édition du style #${id}` : 'Créer un nouveau style.'}
        breadcrumbs={[
          { label: 'Styles', to: '/admin/styles' },
          { label: isEdit ? 'Modifier' : 'Nouveau' },
        ]}
        actions={
          <button type="button" onClick={() => navigate('/admin/styles')}
            className="flex items-center gap-2 border border-black/20 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#B85C38]">
            <ArrowLeft size={16} /> Retour
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-black/10">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Nom *</label>
          <input {...register('name', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Slug *</label>
          <input {...register('slug', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Style Parent</label>
          <select {...register('parent_id')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
            <option value="">Aucun (style racine)</option>
            {parentStyles.filter((s) => s.id !== parseInt(id)).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Description</label>
          <textarea {...register('description')} rows="4" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
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