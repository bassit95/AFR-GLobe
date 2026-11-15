import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, FileText, ArrowLeft } from 'lucide-react';
import MDEditor from '@uiw/react-md-editor';
import { fetchArticleBySlug, createArticle, updateArticle } from '@/services/articleService';
import { fetchSources } from '@/services/sourceService';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

export default function AdminArticleForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);

  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [articleId, setArticleId] = useState(null);  // ⚠️ Article = ID pour update

  const { register, handleSubmit, setError, reset, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { status: 'published', article_type: 'culture' },
  });

  useEffect(() => {
    fetchSources({ perPage: 100 }).then((r) => setSources(r.data || []));
    if (isEdit) {
      fetchArticleBySlug(slug).then((r) => {
        const article = r.data;
        setArticleId(article.id);
        reset({ ...article, source_ids: article.sources?.map((s) => s.id) || [] });
        setLoading(false);
      }).catch(() => { toast.error("Impossible de charger l'article"); navigate('/admin/articles'); });
    }
  }, [slug, isEdit, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, source_ids: data.source_ids || [] };
      if (isEdit) await updateArticle(articleId, payload);
      else await createArticle(payload);
      toast.success(isEdit ? 'Article mis à jour !' : 'Article créé !');
      navigate('/admin/articles');
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
        title={isEdit ? "Modifier l'Article" : 'Nouvel Article'}
        description={isEdit ? `Édition de "${slug}"` : 'Créer un nouvel article éditorial.'}
        breadcrumbs={[
          { label: 'Articles', to: '/admin/articles' },
          { label: isEdit ? 'Modifier' : 'Nouveau' },
        ]}
        actions={
          <button type="button" onClick={() => navigate('/admin/articles')}
            className="flex items-center gap-2 border border-black/20 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#B85C38]">
            <ArrowLeft size={16} /> Retour
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-black/10">
        {/* === Titre + Slug === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Titre *</label>
            <input {...register('title', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Slug *</label>
            <input {...register('slug', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
        </div>

        {/* === Type + Statut === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Type *</label>
            <select {...register('article_type', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="culture">Culture</option>
              <option value="mode">Mode</option>
              <option value="portrait">Portrait</option>
              <option value="interview">Interview</option>
              <option value="reportage">Reportage</option>
              <option value="actualite">Actualité</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Statut *</label>
            <select {...register('status', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
            </select>
          </div>
        </div>

        {/* === Image === */}
        <div className="bg-gray-50 p-4 border border-gray-200">
          <Controller name="cover_image" control={control} render={({ field }) => (
            <ImageUpload label="Image de couverture" value={field.value} onChange={field.onChange} />
          )} />
        </div>

        {/* === Excerpt === */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Résumé</label>
          <textarea {...register('excerpt')} rows="2" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
        </div>

        {/* === Contenu Markdown === */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Contenu (Markdown) *</label>
          <Controller name="content" control={control} rules={{ required: 'Requis' }} render={({ field }) => (
            <div data-color-mode="light"><MDEditor value={field.value} onChange={field.onChange} height={400} /></div>
          )} />
          {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
        </div>

        {/* === Sources === */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Sources (Ctrl+Clic)</label>
          <select multiple {...register('source_ids')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none h-32">
            {sources.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </div>

        {/* === SEO === */}
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

        <div className="pt-6 border-t border-black/10 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-[#2E1B20] text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38] disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}