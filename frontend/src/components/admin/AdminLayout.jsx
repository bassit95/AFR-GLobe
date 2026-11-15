import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, ShoppingBag, FileText,
  MapPin, Layers, Tag, Palette, LogOut, Shield, BookOpen, ChevronRight, Home
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // 🎯 MENU GROUPÉ avec icônes
  const menuGroups = [
    {
      label: 'Vue d\'ensemble',
      links: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
      ],
    },
    {
      label: 'Contenu éditorial',
      links: [
        { to: '/admin/creators', icon: Users, label: 'Créateurs' },
        { to: '/admin/brands', icon: Building2, label: 'Marques' },
        { to: '/admin/articles', icon: FileText, label: 'Articles' },
        { to: '/admin/sources', icon: BookOpen, label: 'Sources' },
      ],
    },
    {
      label: 'Catalogue',
      links: [
        { to: '/admin/collections', icon: Layers, label: 'Collections' },
        { to: '/admin/products', icon: ShoppingBag, label: 'Produits' },
        { to: '/admin/boutiques', icon: MapPin, label: 'Boutiques' },
      ],
    },
    {
      label: 'Taxonomies',
      links: [
        { to: '/admin/categories', icon: Tag, label: 'Catégories' },
        { to: '/admin/styles', icon: Palette, label: 'Styles' },
      ],
    },
    {
      label: 'Système',
      links: [
        { to: '/admin/users', icon: Shield, label: 'Utilisateurs' },
      ],
    },
  ];

  const MenuLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors text-sm ${
          isActive
            ? 'bg-[#B85C38] text-white font-bold'
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        }`}
      >
        <Icon size={18} />
        <span className="flex-1">{label}</span>
        {isActive && <ChevronRight size={14} />}
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#F4F1EA]">
      <aside className="w-64 bg-[#2E1B20] text-white flex flex-col fixed inset-y-0 overflow-y-auto">
        <div className="p-6 border-b border-white/10 shrink-0">
          <Link to="/" className="block">
            <h2 className="text-xl font-['Playfair_Display']">Africa Global</h2>
            <span className="text-[10px] uppercase tracking-widest text-[#D4A84B]">Admin Panel</span>
          </Link>
          {/* 🎯 Lien retour site public */}
          <Link
            to="/"
            className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/50 hover:text-[#D4A84B] transition-colors"
          >
            <Home size={11} /> Retour au site
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-6">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <div className="text-[9px] uppercase tracking-widest text-white/40 mb-2 px-3">
                {group.label}
              </div>
              <div className="space-y-1">
                {group.links.map((link) => (
                  <MenuLink key={link.to} {...link} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="px-3 mb-3">
            <p className="text-[10px] text-white/50 uppercase">Connecté en tant que</p>
            <p className="text-sm font-bold truncate">{user?.name}</p>
            <p className="text-[10px] text-[#D4A84B] mt-0.5">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded transition-colors text-sm"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
}