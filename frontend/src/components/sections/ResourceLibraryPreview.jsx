// src/components/sections/ResourceLibraryPreview.jsx
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import CategoryCard from '@/components/Cards/CategoryCard';
import EditorialLabel from '@/components/ui/EditorialLabel';
import useFeaturedResources from '@/hooks/useFeaturedResources';
import { getCategoryLabel } from '@/utils/resourceLibraryHelpers';

const CARD_COLORS = ['#B85C38', '#642B75', '#7C432B'];

export default function ResourceLibraryPreview() {
  const { resources, loading, error } = useFeaturedResources(3);

  // Garde silencieuse : si erreur ou 0 articles, la section n'apparaît pas
  if (error || (!loading && resources.length === 0)) return null;

  return (
    // ✅ Fix : py-20 md:py-32 bg-white py-16 md:py-24 → py-20 md:py-32 bg-white
    <section className="relative py-20 md:py-32 bg-white px-6 md:px-12 border-b border-gray-300 overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-14 md:mb-20 items-end">
          <div className="md:col-span-7">
            <EditorialLabel prefix="N°03" text="Resource Library" />
            <h2 className="impact text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.85] tracking-tight text-black">
              Culture, Textiles &<br />
              <span className="text-gray-300">Field Research.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-sm text-gray-500 leading-relaxed border-l border-gray-300 pl-5">
              Une bibliothèque éditoriale pour explorer les héritages culturels, les savoir-faire, les parcours créatifs et les actualités.
            </p>
            <Link
              to="/resources"
              className="mt-5 inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-widest font-bold text-[#B85C38] hover:text-[#7C432B] transition-colors"
            >
              <span>Explorer la bibliothèque</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 w-full" />
                <div className="h-6 bg-gray-200 mt-5 w-2/3" />
                <div className="h-4 bg-gray-100 mt-2 w-1/2" />
              </div>
            ))
          ) : (
            resources.map((item, index) => (
              <CategoryCard
                key={item.id}
                to={`/resources/${item.slug}`}
                num={`0${index + 1}`}
                title={item.title}
                desc={item.excerpt}
                tag={getCategoryLabel(item.category)}
                image={item.coverImage}
                color={CARD_COLORS[index % CARD_COLORS.length]}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}