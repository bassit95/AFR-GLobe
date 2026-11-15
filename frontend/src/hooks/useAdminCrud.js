// src/hooks/useAdminCrud.js
import useMutation from './useMutation';
import * as creatorSvc from '../services/creatorService';
import * as brandSvc from '../services/brandService';
import * as articleSvc from '../services/articleService';
import * as boutiqueSvc from '../services/boutiqueService';
import * as collectionSvc from '../services/collectionService';
import * as productSvc from '../services/productService';
import * as portfolioSvc from '../services/portfolioService';
import * as resourceSvc from '../services/resourceService';
import * as sourceSvc from '../services/sourceService';
import * as catalogSvc from '../services/catalogService';
import * as locationSvc from '../services/locationService';

/**
 * Chaque hook renvoie { create, update, remove } — 3 × useMutation pré-liés.
 *
 * ⚠️ Bindings :
 *   - Creators : update/remove prennent un SLUG
 *   - Tous les autres : update/remove prennent un ID
 */

export function useAdminCreators() {
  return {
    create: useMutation(creatorSvc.createCreator),
    update: useMutation(creatorSvc.updateCreator),  // (slug, payload)
    remove: useMutation(creatorSvc.deleteCreator),  // (slug)
  };
}

export function useAdminBrands() {
  return {
    create: useMutation(brandSvc.createBrand),
    update: useMutation(brandSvc.updateBrand),      // (id, payload)
    remove: useMutation(brandSvc.deleteBrand),      // (id)
  };
}

export function useAdminArticles() {
  return {
    create: useMutation(articleSvc.createArticle),
    update: useMutation(articleSvc.updateArticle),
    remove: useMutation(articleSvc.deleteArticle),
  };
}

export function useAdminBoutiques() {
  return {
    create: useMutation(boutiqueSvc.createBoutique),
    update: useMutation(boutiqueSvc.updateBoutique),
    remove: useMutation(boutiqueSvc.deleteBoutique),
  };
}

export function useAdminCollections() {
  return {
    create: useMutation(collectionSvc.createCollection),
    update: useMutation(collectionSvc.updateCollection),
    remove: useMutation(collectionSvc.deleteCollection),
  };
}

export function useAdminProducts() {
  return {
    create: useMutation(productSvc.createProduct),
    update: useMutation(productSvc.updateProduct),
    remove: useMutation(productSvc.deleteProduct),
  };
}

export function useAdminPortfolioItems() {
  return {
    create: useMutation(portfolioSvc.createPortfolioItem),
    update: useMutation(portfolioSvc.updatePortfolioItem),
    remove: useMutation(portfolioSvc.deletePortfolioItem),
  };
}

export function useAdminResources() {
  return {
    create: useMutation(resourceSvc.createResource),
    update: useMutation(resourceSvc.updateResource),
    remove: useMutation(resourceSvc.deleteResource),
  };
}

export function useAdminSources() {
  return {
    create: useMutation(sourceSvc.createSource),
    update: useMutation(sourceSvc.updateSource),
    remove: useMutation(sourceSvc.deleteSource),
  };
}

export function useAdminCategories() {
  return {
    create: useMutation(catalogSvc.createCategory),
    update: useMutation(catalogSvc.updateCategory),
    remove: useMutation(catalogSvc.deleteCategory),
  };
}

export function useAdminStyles() {
  return {
    create: useMutation(catalogSvc.createStyle),
    update: useMutation(catalogSvc.updateStyle),
    remove: useMutation(catalogSvc.deleteStyle),
  };
}

export function useAdminCountries() {
  return {
    create: useMutation(locationSvc.createCountry),
    update: useMutation(locationSvc.updateCountry),
    remove: useMutation(locationSvc.deleteCountry),
  };
}

export function useAdminCities() {
  return {
    create: useMutation(locationSvc.createCity),
    update: useMutation(locationSvc.updateCity),
    remove: useMutation(locationSvc.deleteCity),
  };
}

