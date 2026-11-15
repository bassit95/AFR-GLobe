import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, FileText, ShoppingBag, ArrowRight } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ creators: 0, brands: 0, articles: 0, products: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    api.get('/admin/stats', { signal: controller.signal })
      .then((res) => {
        // 🎯 On récupère directement res.data (pas de data.data)
        if (isMounted) setStats(res.data);
      })
      .catch((err) => {
        if (isMounted && err.name !== 'CanceledError' && err.name !== 'AbortError') {
          toast.error('Impossible de charger les statistiques.');
          console.error(err);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-['Playfair_Display'] mb-2">Tableau de bord</h1>
        <p className="text-sm text-gray-500">Bienvenue dans votre espace de gestion Africa Global.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <StatCard icon={Users} title="Créateurs" count={stats.creators} link="/admin/creators" loading={loading} />
        <StatCard icon={Building2} title="Marques" count={stats.brands} link="/admin/brands" loading={loading} />
        <StatCard icon={FileText} title="Articles" count={stats.articles} link="/admin/articles" loading={loading} />
        <StatCard icon={ShoppingBag} title="Produits" count={stats.products} link="/admin/products" loading={loading} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, count, link, loading }) {
  return (
    <div className="bg-white p-6 border border-black/10 shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{title}</h2>
        <Icon size={18} className="text-[#B85C38]" />
      </div>
      <p className="text-4xl font-['Playfair_Display'] mb-4">
        {loading ? (
          <span className="animate-pulse text-gray-300">...</span>
        ) : (
          count
        )}
      </p>
      <Link to={link} className="text-xs font-bold text-[#B85C38] hover:text-[#2E1B20] flex items-center gap-1 uppercase tracking-widest transition-colors">
        Gérer <ArrowRight size={14} />
      </Link>
    </div>
  );
}