import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginSvc, logout as logoutSvc, me as meSvc } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 🎯 Tente de récupérer l'utilisateur via la session cookie
        const userData = await meSvc();
        setUser(userData);
      } catch (error) {
        // Si le cookie est invalide ou absent, l'utilisateur est anonyme
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const userData = await loginSvc({ email, password });
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    await logoutSvc();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);