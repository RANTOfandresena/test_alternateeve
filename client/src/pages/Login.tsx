import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import AuthContainer from '../components/AuthContainer';
import { clearAuthMessages, loginGoogleUser, loginUser } from '../features/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { loading: reduxLoading, error: reduxError, isLoggedIn, user } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(loginUser(form));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    scope: 'openid profile email',
    onSuccess: async (codeResponse) => {
      setLoading(true);
      setError(null);
      try {
        await dispatch(loginGoogleUser(codeResponse.code));
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Erreur lors de la connexion.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Échec du login Google.'),
  });

  return (
    <div className="flex justify-center px-4 py-12 bg-background font-sans">
      <AuthContainer
        title="Connexion"
        subtitle="Accédez à votre espace Alternateeve"
        footer={
          <div className="flex items-center justify-center gap-2 text-secondary text-sm">
            <span>Pas encore de compte ?</span>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-accent font-semibold hover:underline"
            >
              Créer un compte
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-sm font-semibold text-primary">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vous@example.com"
              className="rounded-xl border border-secondary bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm font-semibold text-primary">
            Mot de passe
            <input
              type="password"
              required
              value={form.motDePasse}
              onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
              placeholder="••••••••"
              className="rounded-xl border border-secondary bg-background px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
            />
          </label>

          {(error || reduxError) && (
            <p className="rounded-xl bg-red-50 text-red-700 px-3 py-2 text-sm">{error || reduxError}</p>
          )}
          {isLoggedIn && user && (
            <p className="rounded-xl bg-success/10 text-success px-3 py-2 text-sm">
              Connecté en tant que {user.user.nom}
            </p>
          )}

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 mt-2 hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            disabled={loading || reduxLoading}
          >
            {loading || reduxLoading ? 'Connexion...' : 'Se connecter'}
          </button>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
            <span>ou</span>
          </div>

          <div
            onClick={() => {if(!loading) googleLogin()}}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed cursor-pointer disabled:opacity-60"
          >
            {!loading && (
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="h-5 w-5"
              />
            )}
            {loading ? 'Connexion...' : 'Continuer avec Google'}
          </div>
        </form>
      </AuthContainer>
    </div>
  );
};

export default LoginPage;