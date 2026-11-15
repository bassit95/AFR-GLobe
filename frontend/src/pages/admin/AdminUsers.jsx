// src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Mail, Plus, Shield, User, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';
import AfricanMotif from '@/components/ui/AfricanMotif';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);

  const loadUsers = () => {
    setLoading(true);
    // 🎯 CORRECTION 1 : Ajout du préfixe /admin/
    api.get(`/admin/users?page=${page}`)
      .then(res => {
        setUsers(res.data.data);
        setMeta(res.data.meta);
      })
      .catch(() => {
        toast.error('Impossible de charger les utilisateurs');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, [page]);

  const handleRoleChange = async (id, role) => {
    try {
      // 🎯 CORRECTION 2 : Ajout du préfixe /admin/
      await api.put(`/admin/users/${id}`, { role });
      toast.success('Rôle mis à jour');
      loadUsers();
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer définitivement cet utilisateur ?')) {
      try {
        // 🎯 CORRECTION 3 : Ajout du préfixe /admin/
        await api.delete(`/admin/users/${id}`);
        toast.success('Utilisateur supprimé');
        loadUsers();
      } catch (err) {
        toast.error(err.message || 'Erreur lors de la suppression');
      }
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-['Playfair_Display'] mb-2 text-[#2E1B20]">L'Équipe</h1>
          <p className="text-sm text-gray-500">Gérez les accès et les rôles des membres d'Africa Global.</p>
        </div>
        
        <Link 
          to="/admin/users/create" 
          className="flex items-center gap-2 bg-[#2E1B20] text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-[#B85C38] transition-colors"
        >
          <Plus size={16} /> Nouvel Utilisateur
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-[#B85C38] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-20 border border-black/10 bg-white">
          <User size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-['Playfair_Display'] text-gray-500">Aucun utilisateur trouvé.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((u) => (
              <div key={u.id} className="relative bg-white border border-black/10 overflow-hidden group hover:shadow-lg transition-shadow duration-300 flex flex-col">
                <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                  <AfricanMotif className="h-32 w-10" color="#2E1B20" />
                </div>

                <div className="p-6 pb-4 border-b border-black/5 flex items-start gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-[#2E1B20] text-[#D4A84B] flex items-center justify-center font-bold text-lg font-['Playfair_Display'] shrink-0 shadow-sm">
                    {getInitials(u.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-[#1A1A1A] truncate text-lg">{u.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-1 truncate">
                      <Mail size={12} /> {u.email}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-4 flex-1 flex flex-col justify-between relative z-10 bg-gray-50/50">
                  <div>
                    <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2">Rôle attribué</label>
                    <div className="relative">
                      <Shield size={14} className="absolute left-3 top-2.5 text-[#B85C38]" />
                      <select 
                        value={u.role} 
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="w-full border border-black/10 py-2 pl-9 pr-3 text-xs font-bold uppercase tracking-wider bg-white outline-none focus:border-[#B85C38] cursor-pointer"
                      >
                        <option value="user">Visiteur (Lecture)</option>
                        <option value="editor">Éditeur</option>
                        <option value="admin">Administrateur</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button onClick={() => handleDelete(u.id)} className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1.5 transition-colors">
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {meta && meta.last_page > 1 && (
            <div className="mt-12 flex justify-between items-center border-t border-black/10 pt-6">
              <span className="text-xs text-gray-500">
                Page <strong className="text-black">{meta.current_page}</strong> sur <strong className="text-black">{meta.last_page}</strong>
              </span>
              <div className="flex gap-2">
                <button disabled={meta.current_page === 1} onClick={() => setPage(meta.current_page - 1)} className="p-2 border border-black/20 hover:border-[#B85C38] hover:text-[#B85C38] disabled:opacity-30 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button disabled={meta.current_page === meta.last_page} onClick={() => setPage(meta.current_page + 1)} className="p-2 border border-black/20 hover:border-[#B85C38] hover:text-[#B85C38] disabled:opacity-30 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}