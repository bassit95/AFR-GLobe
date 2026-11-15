import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { fetchBoutique, createBoutique, updateBoutique } from '@/services/boutiqueService';
import { fetchBrands } from '@/services/brandService';
import { fetchCountries, fetchCities } from '@/services/locationService';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

export default function AdminBoutiqueForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [brands, setBrands] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const { register, handleSubmit, setError, reset, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { status: 'published', type: 'physical' },
  });

  const selectedCountryId = watch('country_id');

  useEffect(() => {
    Promise.all([fetchBrands({ perPage: 100 }), fetchCountries({ perPage: 100 })])
      .then(([rb, rc]) => { setBrands(rb.data || []); setCountries(rc.data || []); });
    if (isEdit) {
      fetchBoutique(id).then((r) => {
        const b = r.data;
        reset({ ...b, brand_id: b.brand?.id, country_id: b.country?.id, city_id: b.city?.id });
        setLoading(false);
      }).catch(() => { toast.error('Impossible de charger la boutique'); navigate('/admin/boutiques'); });
    }
  }, [id, isEdit, reset, navigate]);

  useEffect(() => {
    if (selectedCountryId) {
      fetchCities({ countryId: selectedCountryId, perPage: 100 })
        .then((r) => setCities(r.data || [])).catch(() => setCities([]));
    } else setCities([]);
  }, [selectedCountryId]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) await updateBoutique(id, data);
      else await createBoutique(data);
      toast.success(isEdit ? 'Boutique mise à jour !' : 'Boutique créée !');
      navigate('/admin/boutiques');
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
        title={isEdit ? 'Modifier la Boutique' : 'Nouvelle Boutique'}
        description={isEdit ? `Édition de la boutique #${id}` : 'Créer un nouveau point de vente.'}
        breadcrumbs={[
          { label: 'Boutiques', to: '/admin/boutiques' },
          { label: isEdit ? 'Modifier' : 'Nouvelle' },
        ]}
        actions={
          <button type="button" onClick={() => navigate('/admin/boutiques')}
            className="flex items-center gap-2 border border-black/20 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#B85C38]">
            <ArrowLeft size={16} /> Retour
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-black/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Marque</label>
            <select {...register('brand_id')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="">Indépendant</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Nom *</label>
            <input {...register('name', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Image (URL)</label>
          <input {...register('image')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" placeholder="https://..." />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Adresse complète</label>
          <textarea {...register('address')} rows="2" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Pays</label>
            <select {...register('country_id')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="">Sélectionner</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Ville</label>
            <select {...register('city_id')} disabled={!selectedCountryId} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none disabled:bg-gray-100">
              <option value="">Sélectionner</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Téléphone</label>
            <input {...register('phone')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Email</label>
            <input type="email" {...register('email')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Type</label>
            <select {...register('type')} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="physical">Physique</option>
              <option value="online">En ligne</option>
              <option value="both">Les deux</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2 block">Site Web</label>
          <input {...register('website_url')} type="url" className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" placeholder="https://..." />
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