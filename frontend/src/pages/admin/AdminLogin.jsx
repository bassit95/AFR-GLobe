// src/pages/admin/AdminLogin.jsx
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import AfricanMotif from '@/components/ui/AfricanMotif';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    setError, 
    formState: { errors, isSubmitting } 
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const user = await login(data.email, data.password);
      
      if (user.role !== 'admin') {
        setError('root', { message: "Accès réservé aux administrateurs." });
        return;
      }

      navigate('/admin/dashboard');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('root', { message: 'Email ou mot de passe incorrect.' });
      } else if (err.response?.status === 422) {
        const serverErrors = err.response.data.errors;
        Object.entries(serverErrors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
      } else {
        setError('root', { message: 'Une erreur est survenue.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F4F1EA]"> {/* 🎯 Fond global de la page modifié pour le contraste */}
      
      {/* =========================================
          COLONNE GAUCHE : L'IMAGE (55% de l'écran)
      ========================================= */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-[#1A0F12] overflow-hidden">
        <ImageWithFallback
          src="/images/banner/banner-02.jpeg"
          alt="Africa Global Culture"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        {/* Dégradé pour la lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

        {/* Motifs africains en filigrane */}
        <AfricanMotif className="absolute top-20 right-12 h-64 w-12 opacity-40 z-10" color="#D4A84B" />
        <AfricanMotif className="absolute bottom-10 left-12 h-32 w-8 opacity-60 z-10" color="#B85C38" />

        {/* Texte éditorial */}
        <div className="absolute bottom-16 left-16 right-16 z-20">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4A84B] mb-6">
            <span className="w-10 h-px bg-[#D4A84B]" /> Africa Global
          </div>
          <h1 className="font-['Playfair_Display'] text-5xl xl:text-7xl text-white leading-[1.05] mb-6">
            L'Afrique<br />
            <span className="italic text-white/70">crée.</span>
          </h1>
          <p className="text-sm text-gray-300 max-w-md leading-relaxed">
            Accédez à l'espace d'administration pour documenter, connecter et valoriser les talents du continent et de sa diaspora.
          </p>
        </div>
      </div>

      {/* =========================================
          COLONNE DROITE : FORMULAIRE (45% de l'écran)
      ========================================= */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center relative px-8 sm:px-16 md:px-24">
        
        {/* Lien retour (comme le X de l'image) */}
        <Link 
          to="/" 
          className="absolute top-8 right-8 lg:top-12 lg:right-12 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#2E1B20] transition-colors"
        >
          Fermer <ArrowLeft size={14} className="rotate-180" />
        </Link>

        {/* Formulaire sans "carte" */}
        <div className="w-full max-w-md mx-auto">
          
          <div className="mb-12">
            <h2 className="font-['Playfair_Display'] text-4xl text-[#2E1B20] mb-3">Connexion.</h2>
            <p className="text-sm text-gray-500">Saisissez vos identifiants pour continuer.</p>
          </div>

          {/* Erreur Globale */}
          {errors.root && (
            <div className="mb-8 p-4 bg-red-50 border-l-2 border-red-500 text-red-700 text-sm flex items-start gap-3">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{errors.root.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Champ Email */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7C432B] mb-2">Adresse Email</label>
              <input
                type="email"
                {...register('email', { 
                  required: "L'email est obligatoire",
                  pattern: { value: /^\S+@\S+$/i, message: "Format d'email invalide" }
                })}
                className="w-full border-b border-black/20 bg-transparent py-3 text-lg text-[#2E1B20] outline-none focus:border-[#B85C38] transition-colors placeholder:text-gray-300"
                placeholder="admin@africaglobal.com"
              />
              {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7C432B] mb-2">Mot de passe</label>
              <input
                type="password"
                {...register('password', { 
                  required: "Le mot de passe est obligatoire",
                  minLength: { value: 6, message: "6 caractères minimum" }
                })}
                className="w-full border-b border-black/20 bg-transparent py-3 text-lg text-[#2E1B20] outline-none focus:border-[#B85C38] transition-colors placeholder:text-gray-300"
                placeholder="••••••••"
              />
              {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#2E1B20] text-white py-5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B85C38] transition-colors disabled:opacity-50 mt-4"
            >
              {isSubmitting ? 'Vérification...' : 'Se connecter'}
            </button>
          </form>

          {/* Motif de bas de page */}
          <div className="mt-16 flex justify-start opacity-40">
            <AfricanMotif className="h-6 w-48" color="#B85C38" horizontal />
          </div>
        </div>
      </div>
    </div>
  );
}