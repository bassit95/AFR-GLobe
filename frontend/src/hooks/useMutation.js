// src/hooks/useMutation.js
import { useCallback, useState } from 'react';

/**
 * Hook générique pour une mutation (POST/PUT/DELETE).
 * N'abort PAS — on ne veut pas annuler un POST en cours.
 *
 * @param {(...args) => Promise<any>} mutationFn
 *
 * @returns { mutate, loading, error, success, reset }
 *
 * `error` = { type, message, fields, status } — `fields` rempli sur 422 Laravel.
 */
export default function useMutation(mutationFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const mutate = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);
      setSuccess(false);
      try {
        const result = await mutationFn(...args);
        setSuccess(true);
        return result;
      } catch (err) {
        const shaped = {
          type: err?.type || 'generic',
          message: err?.message || 'Une erreur est survenue.',
          fields: err?.fields || null,
          status: err?.status || 0,
        };
        setError(shaped);
        throw shaped;
      } finally {
        setLoading(false);
      }
    },
    [mutationFn]
  );

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  return { mutate, loading, error, success, reset };
}