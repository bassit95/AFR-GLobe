// src/components/sections/NewsletterSection.jsx
import { useForm } from 'react-hook-form';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import AfricanMotif from '@/components/ui/AfricanMotif';
import { subscribeToNewsletter } from '@/services/newsletterService';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await subscribeToNewsletter(data);
      toast.success(response.message);
      reset(); // Vide le champ
    } catch (err) {
      if (err.response?.status === 422) {
        setError('email', { type: 'server', message: err.response.data.errors.email[0] });
      } else {
        toast.error(err.message || 'Une erreur est survenue.');
      }
    }
  };

  return (
    <section className="relative bg-[#2E1B20] text-white py-24 px-6 md:px-12 overflow-hidden flex flex-col justify-end min-h-[50vh]">
      
      {/* 1. L'IMAGE DE FOND */}
      <ImageWithFallback
        src="/images/banner/banner-02.jpeg" 
        alt="Africa Global Newsletter"
        className="absolute inset-0 w-full h-full object-cover object-center grayscale opacity-30"
      />
      
      {/* 2. VOILE SOMBRE */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2E1B20] via-[#2E1B20]/80 to-transparent" />

      {/* 3. MOTIF AFRICAIN */}
      <AfricanMotif className="absolute top-10 right-10 h-48 w-12 opacity-20 z-10" color="#D4A84B" />

      {/* 4. CONTENU */}
      <div className="relative z-20 max-w-[1000px] mx-auto w-full">
        
        <div className="text-center mb-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4A84B] mb-4 font-bold">
            Restez informé
          </p>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl italic mb-6">
            Rejoignez la Newsletter.
          </h2>
          <p className="text-white/60 text-sm max-w-lg mx-auto">
            Recevez nos dernières découvertes, articles et actualités culturelles directement dans votre boîte mail.
          </p>
        </div>

        {/* 🎯 LE FORMULAIRE */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto items-start">
          {/* Honeypot */}
          <input type="text" {...register('website')} className="hidden" tabIndex="-1" autoComplete="off" />

          <div className="flex-1 w-full relative">
            <input
              type="email"
              {...register('email', { 
                required: "Votre email est requis",
                pattern: { value: /^\S+@\S+$/i, message: "Format d'email invalide" }
              })}
              placeholder="votre@email.com"
              className="w-full bg-transparent border-b border-white/30 py-4 text-xl md:text-2xl text-white outline-none focus:border-[#D4A84B] transition-colors placeholder:text-white/20 font-['Playfair_Display'] italic"
            />
            {errors.email && <p className="text-red-400 text-xs absolute -bottom-6 left-0">{errors.email.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto bg-[#D4A84B] text-[#2E1B20] px-10 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-white transition-colors disabled:opacity-50 mt-4 md:mt-0"
          >
            {isSubmitting ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

      </div>

      {/* Grand Mot "CONNECT" en bas pour garder l'esprit de ton design */}
      <div className="relative z-20 w-full border-t border-white/10 mt-20 pt-8 text-center opacity-20">
        <h2 className="impact text-[15vw] leading-[0.7] tracking-tighter text-white">
          CONNECT.
        </h2>
      </div>
    </section>
  );
}