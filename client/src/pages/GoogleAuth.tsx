import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { loginUser } from '../features/authSlice';
import { useAppDispatch } from '../hooks/hooks';

const GoogleAuth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch()

  const login = useGoogleLogin({
    flow: 'auth-code',
    scope: 'openid profile email',
    onSuccess: async (codeResponse) => {
      setLoading(true);
      setError(null);
      try {
        dispatch(loginUser(codeResponse.code));
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Erreur lors de la connexion.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Échec du login Google.');
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-8 shadow-lg">
        <h2 className="mb-2 text-center text-xl font-semibold text-gray-800">
          Connexion
        </h2>
        <p className="mb-6 text-center text-sm text-gray-500">
          Connectez-vous avec votre compte Google
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={() => login()}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {!loading && (
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="h-5 w-5"
            />
          )}
          {loading ? 'Connexion...' : 'Continuer avec Google'}
        </button>
      </div>
    </div>
  );
};

export default GoogleAuth;