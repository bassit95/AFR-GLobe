import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Save, UserPlus, ArrowLeft } from 'lucide-react';
import api from '@/services/api';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import toast from 'react-hot-toast';

export default function AdminUserForm() {
  const navigate = useNavigate();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { role: 'editor' },
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/admin/users', data);
      toast.success('Utilisateur créé !');
      navigate('/admin/users');
    } catch (err) {
      if (err.response?.status === 422) {
        Object.keys(err.response.data.errors).forEach((f) =>
          setError(f, { message: err.response.data.errors[f][0] })
        );
        toast.error('Veuillez corriger les erreurs.');
      } else toast.error(err.message || 'Une erreur est survenue');
    }
  };

  return (
    <div className="max-w-2xl">
      <AdminPageHeader
        title="Nouvel Utilisateur"
        description="Créer un compte administrateur ou éditeur."
        breadcrumbs={[
          { label: 'Utilisateurs', to: '/admin/users' },
          { label: 'Nouveau' },
        ]}
        actions={
          <button type="button" onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2 border border-black/20 px-4 py-3 text-xs font-bold uppercase tracking-widest hover:border-[#B85C38]">
            <ArrowLeft size={16} /> Retour
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 border border-black/10">
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Nom complet *</label>
          <input {...register('name', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Email *</label>
          <input type="email" {...register('email', { required: "L'email est obligatoire", pattern: { value: /^\S+@\S+$/i, message: 'Format invalide' } })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Mot de passe *</label>
            <input type="password" {...register('password', { required: 'Requis', minLength: { value: 8, message: '8 caractères min.' } })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Rôle *</label>
            <select {...register('role', { required: 'Requis' })} className="w-full border border-gray-300 p-3 text-sm focus:border-[#B85C38] outline-none">
              <option value="editor">Éditeur (accès limité)</option>
              <option value="admin">Administrateur (accès total)</option>
            </select>
          </div>
        </div>

        <div className="pt-6 border-t border-black/10 flex justify-end">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-[#2E1B20] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38] disabled:opacity-50">
            <Save size={16} /> {isSubmitting ? 'Création...' : 'Créer le compte'}
          </button>
        </div>
      </form>
    </div>
  );
}