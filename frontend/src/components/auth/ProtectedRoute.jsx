// src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  // 1. On attend que le contexte ait fini de vérifier le token (au chargement de la page)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F6]">
        <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Vérification de la session...</p>
      </div>
    );
  }

  // 2. Si l'utilisateur n'est pas connecté -> on le renvoie vers le login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si la page requiert un admin, mais que l'utilisateur ne l'est pas
  if (requireAdmin && !isAdmin) {
    console.log("Accès refusé : L'utilisateur n'est pas admin");
    return <Navigate to="/" replace />;
  }

  // 4. Tout est OK : on affiche la page enfant (le Dashboard)
  return <Outlet />;
}