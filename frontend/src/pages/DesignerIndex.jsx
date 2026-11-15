// src/pages/DesignerIndex.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageBanner from '../components/Cards/PageBanner';
import CreatorIndexHero from '../components/creators/CreatorIndexHero';
import CreatorFilterToolbar from '../components/creators/CreatorFilterToolbar';
import CountrySidebar from '../components/creators/CountrySidebar';
import CreatorGrid from '../components/creators/CreatorGrid';
import ImageWithFallback from '@/components/ui/ImageWithFallback';
import LoadingState from '@/components/ui/LoadingState';

import useCreatorDirectory from '../hooks/useCreatorDirectory';
import useBrands from '../hooks/useBrands';
import useProducts from '../hooks/useProducts';
import useCollections from '../hooks/useCollections';
import { formatPrice } from '@/utils/formatters';

import bannerIndex from '/images/banner/banner-03.jpeg';

// ✅ CHAQUE ONGLET EST UN COMPOSANT ISOLÉ → hooks montés uniquement si actif
function BrandsTab() {
  const brandDir = useBrands();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {brandDir.loading && <LoadingState variant="skeleton" count={6} />}
      {!brandDir.loading &&
        brandDir.data?.map((brand) => (
          <Link
            key={brand.id}
            to={`/marques/${brand.slug}`}
            className="group border border-black/10 bg-white p-4 hover:shadow-lg transition-all"
          >
            <div className="relative aspect-[4/3] bg-[#EFE8DC] mb-4 overflow-hidden">
              <ImageWithFallback
                src={brand.cover_image || brand.logo}
                alt={brand.name}
                nameForFallback={brand.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl">{brand.name}</h3>
            <p className="text-xs text-gray-500 mt-1">
              {brand.city?.name}, {brand.country?.name}
            </p>
          </Link>
        ))}
    </div>
  );
}

function CollectionsTab() {
  const collectionDir = useCollections();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {collectionDir.loading && <LoadingState variant="skeleton" count={6} />}
      {!collectionDir.loading &&
        collectionDir.data?.map((col) => (
          <Link
            key={col.id}
            to={`/collections/${col.slug}`}
            className="group border border-black/10 bg-white p-4 hover:shadow-lg transition-all"
          >
            <div className="relative aspect-[4/3] bg-[#EFE8DC] mb-4 overflow-hidden">
              <ImageWithFallback
                src={col.cover_image}
                alt={col.name}
                nameForFallback={col.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="font-['Playfair_Display'] text-2xl">{col.name}</h3>
            <p className="text-xs text-[#9A6142] font-bold uppercase mt-1">
              {col.brand?.name}
            </p>
          </Link>
        ))}
    </div>
  );
}

function ProductsTab() {
  const productDir = useProducts();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {productDir.loading && <LoadingState variant="skeleton" count={8} />}
      {!productDir.loading &&
        productDir.data?.map((prod) => (
          <Link
            key={prod.id}
            to={`/produits/${prod.slug}`}
            className="group border border-black/10 bg-white p-3 hover:shadow-lg transition-all flex flex-col"
          >
            <div className="relative aspect-[3/4] bg-[#EFE8DC] mb-3 overflow-hidden">
              <ImageWithFallback
                src={prod.image}
                alt={prod.name}
                nameForFallback={prod.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <h3 className="font-['Playfair_Display'] text-lg line-clamp-1">{prod.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{prod.brand?.name}</p>
            <p className="text-sm font-bold mt-auto">
              {formatPrice(prod.price, prod.currency)}
            </p>
          </Link>
        ))}
    </div>
  );
}

export default function DesignerIndex() {
  const [activeTab, setActiveTab] = useState('creators');

  // ✅ Seul creatorDir est monté au départ — les 3 autres attendent leur onglet
  const creatorDir = useCreatorDirectory();

  return (
    <main className="min-h-screen bg-[#F9F8F6] pb-20 font-['Inter'] text-[#1A1A1A] selection:bg-[#2E1B20] selection:text-white">
      <PageBanner title="Index Global." currentPage="Index Global" imageUrl={bannerIndex} />

      <CreatorIndexHero
        query={activeTab === 'creators' ? creatorDir.query : ''}
        onQueryChange={activeTab === 'creators' ? creatorDir.setQuery : () => {}}
      />

      <CreatorFilterToolbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sortOrder={creatorDir.sortOrder}
        onSortChange={creatorDir.setSortOrder}
        hasActiveFilters={creatorDir.hasActiveFilters}
        onReset={creatorDir.resetFilters}
        selectedLetter={creatorDir.selectedLetter}
        onLetterChange={creatorDir.setSelectedLetter}
        visibleCategories={creatorDir.visibleCategories}
        selectedCategories={creatorDir.selectedCategories}
        onToggleCategory={creatorDir.toggleCategory}
        showAllCategories={creatorDir.showAllCategories}
        onToggleAllCategories={creatorDir.toggleShowAllCategories}
        showAlphabet={activeTab === 'creators' || activeTab === 'brands'}
      />

      <section className="relative min-h-[55vh] overflow-hidden bg-[#F9F8F6]">
        <div className="relative z-10 mx-auto flex max-w-[1500px] flex-col gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:flex-row lg:px-10">
          {activeTab === 'creators' && (
            <CountrySidebar
              countries={creatorDir.countries}
              selectedCountry={creatorDir.selectedCountry}
              onCountryChange={creatorDir.setSelectedCountry}
            />
          )}

          <div className="flex-1">
            {/* ✅ Seul le composant de l'onglet actif monte → seul son hook fetch */}
            {activeTab === 'creators' && (
              <CreatorGrid
                creators={creatorDir.creators}
                loading={creatorDir.loading}
                error={creatorDir.error}
                totalCount={creatorDir.meta?.total}
                meta={creatorDir.meta}
                onPageChange={creatorDir.setPage}
                onReset={creatorDir.resetFilters}
                onRetry={() => window.location.reload()}
              />
            )}
            {activeTab === 'brands' && <BrandsTab />}
            {activeTab === 'collections' && <CollectionsTab />}
            {activeTab === 'products' && <ProductsTab />}
          </div>
        </div>
      </section>
    </main>
  );
}