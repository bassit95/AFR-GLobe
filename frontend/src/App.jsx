import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Pages Admin
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout & Pages Publics
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import DesignerIndex from './pages/DesignerIndex';
import CreatorProfile from './pages/CreatorProfile';
import SearchResults from './pages/SearchResults';
import About from './pages/About';
import Contact from './pages/Contact';
import Immersion from './pages/Immersion';
import ResourceLibrary from './pages/ResourceLibrary';
import NotFound from './pages/NotFound';
import BrandIndex from './pages/BrandIndex';
import BrandProfile from './pages/BrandProfile';
import BoutiqueDetail from './pages/BoutiqueDetail';
import ProductIndex from './pages/ProductIndex';
import ProductDetail from './pages/ProductDetail';
import CollectionIndex from './pages/CollectionIndex';
import CollectionDetail from './pages/CollectionDetail';

// Imports Admin (Manquants dans ta version)
import AdminBrands from './pages/admin/AdminBrands';
import AdminBrandForm from './pages/admin/AdminBrandForm';
import AdminCreators from './pages/admin/AdminCreators';
import AdminCreatorForm from './pages/admin/AdminCreatorForm';
import AdminArticles from './pages/admin/AdminArticles'; // 🎯 Ajouté
import AdminArticleForm from './pages/admin/AdminArticleForm'; // 🎯 Ajouté
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminBoutiques from './pages/admin/AdminBoutiques';
import AdminBoutiqueForm from './pages/admin/AdminBoutiqueForm';
import AdminCollections from './pages/admin/AdminCollections'; // 🎯 Ajouté
import AdminCollectionForm from './pages/admin/AdminCollectionForm'; // 🎯 Ajouté
import AdminCategories from './pages/admin/AdminCategories';
import AdminCategoryForm from './pages/admin/AdminCategoryForm';
import AdminStyles from './pages/admin/AdminStyles';
import AdminStyleForm from './pages/admin/AdminStyleForm';
// N'oublie pas l'import
import AdminSources from './pages/admin/AdminSources';
import AdminSourceForm from './pages/admin/AdminSourceForm';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserForm from './pages/admin/AdminUserForm';

export default function App() {
  return (
    <>
      <Routes>
        {/* =========================================
            ROUTES PUBLIQUES (avec Navbar & Footer)
        ========================================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/creators" element={<DesignerIndex />} />
          <Route path="/creators/:creatorId" element={<CreatorProfile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/immersion" element={<Immersion />} />
          <Route path="/boutiques/:id" element={<BoutiqueDetail />} />
          <Route path="/resources" element={<ResourceLibrary />} />
          <Route path="/resources/:slug" element={<ResourceLibrary />} />
          <Route path="/marques" element={<BrandIndex />} />
          <Route path="/marques/:slug" element={<BrandProfile />} />
          <Route path="/produits" element={<ProductIndex />} />
          <Route path="/produits/:slug" element={<ProductDetail />} />
          <Route path="/collections" element={<CollectionIndex />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* =========================================
            ROUTE DE LOGIN (Isolée, sans Layout)
        ========================================= */}
        <Route path="/login" element={<AdminLogin />} />

        {/* =========================================
            ROUTES ADMIN (Protégées par le AuthContext)
        ========================================= */}
        {/* 🎯 C'est ICI que la sécurité opère : ProtectedRoute vérifie si user.role === 'admin' */}
        <Route element={<ProtectedRoute requireAdmin={true} />}>
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            
            {/* Contenu */}
            <Route path="creators" element={<AdminCreators />} />
            <Route path="creators/create" element={<AdminCreatorForm />} />
            <Route path="creators/:slug/edit" element={<AdminCreatorForm />} />
            
            <Route path="brands" element={<AdminBrands />} />
            <Route path="brands/create" element={<AdminBrandForm />} />
            <Route path="brands/:id/edit" element={<AdminBrandForm />} />
            
            <Route path="articles" element={<AdminArticles />} />
            <Route path="articles/create" element={<AdminArticleForm />} />
            <Route path="articles/:slug/edit" element={<AdminArticleForm />} />

            {/* Catalogue */}
            <Route path="collections" element={<AdminCollections />} />
            <Route path="collections/create" element={<AdminCollectionForm />} />
            <Route path="collections/:slug/edit" element={<AdminCollectionForm />} />

            <Route path="products" element={<AdminProducts />} />
            <Route path="products/create" element={<AdminProductForm />} />
            <Route path="products/:slug/edit" element={<AdminProductForm />} />

            <Route path="boutiques" element={<AdminBoutiques />} />
            <Route path="boutiques/create" element={<AdminBoutiqueForm />} />
            <Route path="boutiques/:slug/edit" element={<AdminBoutiqueForm />} />

            {/* Taxonomies */}
            <Route path="categories" element={<AdminCategories />} />
            <Route path="categories/create" element={<AdminCategoryForm />} />
            <Route path="categories/:id/edit" element={<AdminCategoryForm />} />

            <Route path="styles" element={<AdminStyles />} />
            <Route path="styles/create" element={<AdminStyleForm />} />
            <Route path="styles/:id/edit" element={<AdminStyleForm />} />
<Route path="sources" element={<AdminSources />} />
<Route path="sources/create" element={<AdminSourceForm />} />
<Route path="sources/:id/edit" element={<AdminSourceForm />} />
<Route path="users" element={<AdminUsers />} />
<Route path="users/create" element={<AdminUserForm />} />
          </Route>

        </Route>
      </Routes>
      
      <Toaster position="top-right" />
    </>
  );
}