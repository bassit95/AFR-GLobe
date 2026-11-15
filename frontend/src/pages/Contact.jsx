// src/pages/Contact.jsx
import { useForm } from 'react-hook-form';
import PageBanner from '@/components/Cards/PageBanner';
import AfricanMotif from '@/components/ui/AfricanMotif';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import { sendContactMessage } from '@/services/contactService';
import toast from 'react-hot-toast';

const bannerImage = '/images/banner/banner-02.jpeg';

export default function Contact() {
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await sendContactMessage(data);
      toast.success(response.message);
      reset(); // Vide le formulaire
    } catch (err) {
      if (err.response?.status === 422) {
        const serverErrors = err.response.data.errors;
        Object.keys(serverErrors).forEach((field) => {
          setError(field, { type: 'server', message: serverErrors[field][0] });
        });
        toast.error('Veuillez corriger les erreurs.');
      } else {
        toast.error(err.message || 'Une erreur est survenue.');
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#F4F1EA] font-['Inter'] text-[#1A1A1A] overflow-hidden">
      <PageBanner
        title="Contact."
        currentPage="Contact"
        imageUrl={bannerImage}
        subtitle="Proposer un créateur, une marque ou une ressource."
      />

      {/* =========================================
          SECTION PRINCIPALE (Style Éditorial)
      ========================================= */}
      <section className="relative max-w-[1500px] mx-auto px-6 md:px-12 py-16 md:py-24">
        
        {/* Motif Africain en filigrane */}
        <AfricanMotif className="absolute top-10 right-10 h-64 w-12 opacity-10 hidden md:block" color="#2E1B20" />

        {/* Grand Titre "CONTACT" */}
        <div className="mb-16 md:mb-24 text-center">
          <h1 className="impact text-[18vw] md:text-[12vw] leading-[0.8] tracking-tighter uppercase text-[#2E1B20]">
            Contact
          </h1>
          <div className="flex justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#B85C38] mt-6">
            <span>Designer</span> <span>✱</span> <span>Creative</span> <span>✱</span> <span>Developer</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          
          {/* COLONNE GAUCHE : Infos & Image (3 cols) */}
          <div className="md:col-span-3 flex flex-col gap-8">
            <div className="text-xs leading-relaxed text-gray-600">
              <p className="font-bold text-[#2E1B20] uppercase tracking-widest mb-2">Prêt à collaborer ?</p>
              <p>Créons ensemble quelque chose d'unique. N'hésitez pas à nous contacter pour toute proposition.</p>
            </div>

            {/* Petit cadre d'image */}
            <div className="relative aspect-square w-full border border-[#2E1B20]/20 p-2 bg-[#E8E0D3]">
              <ImageWithFallback
                src="/images/home/immersion-03.png"
                alt="Africa Global"
                className="w-full h-full object-cover grayscale"
              />
              <div className="absolute -bottom-4 -right-4 text-[#B85C38] font-['Playfair_Display'] italic text-3xl">
                Africa
              </div>
            </div>

            {/* Code-barres (Faux) */}
            <div className="flex flex-col items-center justify-center opacity-60">
              <div className="flex gap-1 h-12 w-full max-w-[150px]">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className={`bg-[#2E1B20] h-full ${i % 3 === 0 ? 'w-2' : 'w-1'}`} />
                ))}
              </div>
              <span className="text-[9px] font-mono tracking-[0.2em] mt-2">+225 07 00 00 00 00</span>
            </div>
          </div>

          {/* COLONNE DROITE : Le Formulaire (9 cols) */}
          <div className="md:col-span-9 md:pl-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
              
              {/* Honeypot (Invisible pour les humains) */}
              <input type="text" {...register('website')} className="hidden" tabIndex="-1" autoComplete="off" />

              {/* Nom */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-2">Qui êtes-vous ?</label>
                <input
                  type="text"
                  {...register('name', { required: 'Votre nom est requis' })}
                  placeholder="{ votre nom }"
                  className="w-full bg-transparent border-b border-[#2E1B20]/30 py-3 text-2xl md:text-3xl text-[#2E1B20] outline-none focus:border-[#B85C38] transition-colors placeholder:text-gray-400 font-['Playfair_Display']"
                />
                {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-2">Comment communiquer ?</label>
                <input
                  type="email"
                  {...register('email', { 
                    required: "L'email est requis",
                    pattern: { value: /^\S+@\S+$/i, message: "Format d'email invalide" }
                  })}
                  placeholder="{ votre email }"
                  className="w-full bg-transparent border-b border-[#2E1B20]/30 py-3 text-2xl md:text-3xl text-[#2E1B20] outline-none focus:border-[#B85C38] transition-colors placeholder:text-gray-400 font-['Playfair_Display']"
                />
                {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
              </div>

              {/* Message */}
              <div className="relative">
                <label className="block text-xs font-bold text-gray-500 mb-2">Quelle est votre demande ?</label>
                <textarea
                  rows="4"
                  {...register('message', { required: 'Le message est requis' })}
                  placeholder="{ votre message }"
                  className="w-full bg-transparent border-b border-[#2E1B20]/30 py-3 text-xl md:text-2xl text-[#2E1B20] outline-none focus:border-[#B85C38] transition-colors placeholder:text-gray-400 font-['Playfair_Display'] resize-none"
                />
                {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message.message}</p>}
              </div>

              {/* Bouton d'envoi */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#D4A84B] text-[#2E1B20] px-12 py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#B85C38] hover:text-white transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi...' : 'Envoyer'}
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

    </main>
  );
}