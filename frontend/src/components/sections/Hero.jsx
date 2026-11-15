import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, EffectFade } from 'swiper/modules';
import { MoveRight } from 'lucide-react';
import MainBtn from '../ui/button/MainBtn';
// Styles Swiper requis
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HERO_SLIDES = [
  {
    id: 1,
    image: '/images/hero/hero-fashion-01.png',
    eyebrow: 'NEW PERSPECTIVES',
    titleMain: 'THE FUTURE IS',
    titleHighlight: 'AFRICAN',
    description: "Africa Global est le répertoire vivant des créateurs, designers et esprits visionnaires qui façonnent l'économie créative du continent.",
    linkText: 'EXPLORER L\'INDEX',
    linkPath: '/creators',
  },
  {
    id: 2,
    image: '/images/hero/hero-fashion-02.jpeg',
    eyebrow: 'AFRICAN CREATORS',
    titleMain: 'MADE WITH',
    titleHighlight: 'INTENTION',
    description: 'Célébrer la rigueur artisanale, les textiles patrimoniaux et le design contemporain à travers une archive culturelle d\'exception.',
    linkText: 'DÉCOUVRIR LES TALENTS',
    linkPath: '/creators',
  },
  {
    id: 3,
    image: '/images/hero/hero-fashion-03.png',
    eyebrow: 'BEYOND BORDERS',
    titleMain: 'A LIVING',
    titleHighlight: 'ARCHIVE',
    description: 'Une plateforme d\'indexation indépendante connectant les maisons de création africaines et leur diaspora à l\'échelle mondiale.',
    linkText: 'REJOINDRE L\'IMMERSION',
    linkPath: '/about',
  },
];

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      <Swiper
        modules={[Autoplay, Navigation, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={true}
        navigation={{
          nextEl: '.hero-next',
          prevEl: '.hero-prev',
        }}
        className="heroSwiper w-full min-h-screen"
      >
        {HERO_SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="relative min-h-screen w-full flex flex-col justify-center items-center px-[4%] md:px-[8%] xl:px-[12%] py-[8%] xl:py-[12%] bg-no-repeat bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Masque sombre */}
              <div className="absolute inset-0 bg-black/50 z-0" />

              {/* Contenu textuel */}
              <div className="relative z-10 hero-content text-white text-center max-w-5xl mx-auto">
                <p className="text-xs sm:text-sm font-medium tracking-[0.3em] text-[#D4A574] uppercase pb-3">
                  {slide.eyebrow}
                </p>

                <h1 className="impact text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-normal uppercase tracking-wider leading-none pb-6">
                  {slide.titleMain}{' '}
                  <span className="block text-[#D4A574] w-fit mx-auto">
                    {slide.titleHighlight}
                  </span>
                </h1>

                <p className="max-w-2xl mx-auto pb-10 text-gray-200 font-light text-sm sm:text-base md:text-lg leading-relaxed">
                  {slide.description}
                </p>

                {/* 🎯 INTÉGRATION DU MAINBTN */}
                <div className="flex justify-center">
                  <MainBtn 
                    text={slide.linkText} 
                    path={slide.linkPath} 
                    className="group"
                  >
                    <MoveRight className="w-4 h-4 ml-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </MainBtn>
                </div>

              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Boutons de Navigation */}
      <button
        className="hero-prev absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-black transition duration-300 cursor-pointer"
        aria-label="Image précédente"
      ></button>

      <button
        className="hero-next absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-black/40 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-black transition duration-300 cursor-pointer"
        aria-label="Image suivante"
      ></button>

    </section>
  );
}

export default Hero;