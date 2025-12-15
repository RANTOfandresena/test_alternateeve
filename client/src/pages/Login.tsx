import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../components/AuthContainer';
import { loginUser } from '../features/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error, isLoggedIn, user } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // dispatch(loginUser(form));
  };

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

          {error && (
            <p className="rounded-xl bg-error/10 text-error px-3 py-2 text-sm">{error}</p>
          )}
          {isLoggedIn && user && (
            <p className="rounded-xl bg-success/10 text-success px-3 py-2 text-sm">
              Connecté en tant que {user.user.nom}
            </p>
          )}

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 mt-2 hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </AuthContainer>
    </div>
  );
};

export default LoginPage;

