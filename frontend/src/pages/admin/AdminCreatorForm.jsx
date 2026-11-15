import { useEffect, useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { fetchCreatorBySlug, createCreator, updateCreator } from '@/services/creatorService';
import { fetchCountries, fetchCities } from '@/services/locationService';
import { fetchCategories, fetchStyles } from '@/services/catalogService';
import ImageUpload from '@/components/admin/ImageUpload';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

export default function AdminCreatorForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  const { register, handleSubmit, setError, reset, control, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      awards: [],
      social_links: { instagram: '', linkedin: '' },
      status: 'published',  // ✅ défaut published
    },
  });

  const { fields: awardFields, append: appendAward, remove: removeAward } = useFieldArray({ control, name: 'awards' });
  const selectedCountryId = watch('country_of_residence_id');

  useEffect(() => {
    Promise.all([fetchCountries({ perPage: 100 }), fetchCategories({ perPage: 100 }), fetchStyles({ perPage: 100 })])
      .then(([rc, rcat, rs]) => {
        setCountries(rc.data || []);
        setCategories(rcat.data || []);
        setStyles(rs.data || []);
      });
    if (isEdit) {
      fetchCreatorBySlug(slug).then((res) => {
        const c = res.data;
        reset({
          ...c,
          country_of_origin_id: c.country_of_origin?.id,
          country_of_residence_id: c.country_of_residence?.id,
          city_of_residence_id: c.city_of_residence?.id,
          category_ids: c.categories?.map((x) => x.id) || [],
          style_ids: c.styles?.map((x) => x.id) || [],
          awards: c.awards || [],
          social_links: c.social_links || { instagram: '', linkedin: '' },
          status: c.status || 'draft',
        });
        setLoading(false);
      }).catch(() => { toast.error('Impossible de charger le créateur'); navigate('/admin/creators'); });
    }
  }, [slug, isEdit, reset, navigate]);

  useEffect(() => {
    if (selectedCountryId) fetchCities({ countryId: selectedCountryId, perPage: 100 })
      .then((r) => setCities(r.data || [])).catch(() => setCities([]));
  }, [selectedCountryId]);

  const onSubmit = async (data) => {
    try {
      const cleanAwards = (data.awards || []).filter((a) => a.title && a.title.trim());
      const payload = { ...data, awards: cleanAwards };
      if (isEdit) await updateCreator(slug, payload);
      else await createCreator(payload);
      toast.success(isEdit ? 'Créateur mis à jour !' : 'Créateur créé !');
      navigate('/admin/creators');
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
        title={isEdit ? 'Modifier le Créateur' : 'Nouveau Créateur'}
        description={isEdit ? `Édition de "${slug}"` : 'Créer une nouvelle fiche créateur.'}
        breadcrumbs={[
          { label: 'Créateurs', to: '/admin/creators' },
          { label: isEdit ? 'Modifier' : 'Nouveau' },
        ]}
        actions={
          <button type="button" onClick={() => navigate('/admin/creators')}
            className="flex items-center gap-2 border border-black/20 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#B85C38]">
            <ArrowLeft size={16} /> Retour
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 border border-black/10">
        {/* === Infos de base === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Nom *</label>
            <input {...register('name', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Slug *</label>
            <input {...register('slug', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
        </div>

        {/* === Statut (✅ NOUVEAU) === */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Statut de publication *</label>
          <select {...register('status', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
            <option value="published">Publié (visible sur le site)</option>
            <option value="draft">Brouillon (invisible)</option>
            <option value="archived">Archivé</option>
          </select>
        </div>

        {/* === Images === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 border border-gray-200">
          <Controller name="profile_image" control={control} render={({ field }) => (
            <ImageUpload label="Photo de profil" value={field.value} onChange={field.onChange} />
          )} />
          <Controller name="cover_image" control={control} render={({ field }) => (
            <ImageUpload label="Image de couverture" value={field.value} onChange={field.onChange} />
          )} />
        </div>

        {/* === Localisation === */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Pays d'origine *</label>
            <select {...register('country_of_origin_id', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="">Sélectionner</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Pays de résidence *</label>
            <select {...register('country_of_residence_id', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="">Sélectionner</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Ville de résidence</label>
            <select {...register('city_of_residence_id')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="">Sélectionner</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* === Bio === */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Bio courte</label>
            <input {...register('short_bio')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Biographie complète</label>
            <textarea {...register('biography')} rows="5" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
        </div>

        {/* === Taxonomies === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Catégories (Ctrl+Clic)</label>
            <select multiple {...register('category_ids')} className="w-full border border-gray-300 p-3 text-sm h-32 focus:border-[#B85C38] outline-none">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Styles (Ctrl+Clic)</label>
            <select multiple {...register('style_ids')} className="w-full border border-gray-300 p-3 text-sm h-32 focus:border-[#B85C38] outline-none">
              {styles.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        {/* === Réseaux sociaux === */}
        <div className="bg-gray-50 p-6 border border-gray-200">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#7C432B] mb-4">Réseaux Sociaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-1 block">Instagram</label>
              <input {...register('social_links.instagram')} placeholder="https://instagram.com/..." className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-[#B85C38]" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-1 block">LinkedIn</label>
              <input {...register('social_links.linkedin')} placeholder="https://linkedin.com/in/..." className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-[#B85C38]" />
            </div>
            <div className="md:col-span-2">
              <label className="text-[10px] font-bold text-gray-500 mb-1 block">Site Web</label>
              <input {...register('website_url')} placeholder="https://..." className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-[#B85C38]" />
            </div>
          </div>
        </div>

        {/* === SEO === */}
        <div className="bg-[#F4F1EA] p-6 border border-black/10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-[#7C432B] mb-4">Optimisation SEO</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-1 block">Titre Meta</label>
              <input {...register('meta_title')} className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-[#B85C38]" maxLength={255} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 mb-1 block">Description Meta</label>
              <textarea {...register('meta_description')} rows="2" className="w-full border border-gray-300 p-3 text-sm outline-none focus:border-[#B85C38]" maxLength={500} />
            </div>
          </div>
        </div>

        {/* === Awards === */}
        <div className="bg-[#F4F1EA] p-6 border border-black/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#7C432B]">Récompenses</h3>
            <button type="button" onClick={() => appendAward({ title: '', org: '', year: '', url: '' })}
              className="flex items-center gap-1 text-xs font-bold text-[#B85C38] hover:text-[#2E1B20]">
              <Plus size={14} /> Ajouter
            </button>
          </div>
          <div className="space-y-4">
            {awardFields.map((field, index) => (
              <div key={field.id} className="relative bg-white p-4 border border-gray-200">
                <button type="button" onClick={() => removeAward(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-bold text-gray-500 mb-1 block">Titre *</label>
                    <input {...register(`awards.${index}.title`, { required: true })} className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-[#B85C38]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 mb-1 block">Organisation</label>
                    <input {...register(`awards.${index}.org`)} className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-[#B85C38]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 mb-1 block">Année</label>
                    <input type="number" {...register(`awards.${index}.year`, { setValueAs: (v) => v === '' ? null : parseInt(v, 10) })} className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-[#B85C38]" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 mb-1 block">Lien (URL)</label>
                    <input {...register(`awards.${index}.url`)} className="w-full border border-gray-300 p-2 text-sm outline-none focus:border-[#B85C38]" />
                  </div>
                </div>
              </div>
            ))}
            {awardFields.length === 0 && <p className="text-xs text-gray-500 italic">Aucune récompense ajoutée.</p>}
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