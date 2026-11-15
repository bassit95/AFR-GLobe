// src/hooks/useAuth.js
import { useCallback, useEffect, useState } from 'react';
import { 
  login as loginSvc, 
  logout as logoutSvc, 
  register as registerSvc, 
  me as meSvc 
} from '../services/authService';

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true au début pour vérifier la session
  const [error, setError] = useState(null);

  // 🎯 Au chargement de l'app, on demande au backend si le cookie de session est valide
  useEffect(() => {
    let cancelled = false;

    meSvc()
      .then((freshUser) => {
        if (!cancelled) setUser(freshUser);
      })
      .catch((err) => {
        // Si erreur 401 (non connecté), on ne fait rien, l'utilisateur est juste anonyme
        if (!cancelled && err?.type !== 'unauthorized') {
          console.error('Erreur session:', err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await loginSvc(credentials);
      setUser(userData); // Le backend a posé le cookie HttpOnly
      return userData;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const userData = await registerSvc(payload);
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutSvc(); // Le backend détruit le cookie
    } finally {
      setUser(null);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };
}