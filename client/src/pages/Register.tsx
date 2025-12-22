import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContainer from '../components/AuthContainer';
import { clearAuthMessages, registerUser } from '../features/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error, message } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ nom: '', email: '', motDePasse: '', confirmMotDePasse: ''});
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.motDePasse !== form.confirmMotDePasse) {
      setPasswordError("Les mots de passe ne correspondent pas");
      return;
    }
    setPasswordError(null);
    const { confirmMotDePasse, ...payload } = form;
    dispatch(registerUser(payload));
  };

  useEffect(() => {
    dispatch(clearAuthMessages());
  }, [dispatch]);

  return (
    <div className="flex justify-center px-4 py-12">
      <AuthContainer
        title="Créer un compte"
        subtitle="Rejoignez la plateforme Alternateeve"
        footer={
          <div className="flex items-center justify-center gap-2 text-slate-600 text-sm">
            <span>Déjà inscrit ?</span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Retour à la connexion
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nom */}
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
            Nom
            <input
              type="text"
              required
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              placeholder="Jean Dupont"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </label>

          {/* Email */}
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="vous@example.com"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </label>

          {/* Mot de passe */}
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
            Mot de passe
            <input
              type="password"
              required
              value={form.motDePasse}
              onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
              placeholder="••••••••"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </label>

          {/* Confirmation mot de passe */}
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
            Confirmer le mot de passe
            <input
              type="password"
              required
              value={form.confirmMotDePasse}
              onChange={(e) => setForm({ ...form, confirmMotDePasse: e.target.value })}
              placeholder="••••••••"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </label>

          {/* Erreurs */}
          {passwordError && (
            <p className="rounded-xl bg-red-50 text-red-700 px-3 py-2 text-sm">{passwordError}</p>
          )}
          {error && (
            <p className="rounded-xl bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</p>
          )}
          {message && (
            <p className="rounded-xl bg-green-50 text-green-700 px-3 py-2 text-sm">{message}</p>
          )}

          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 mt-2 hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>
      </AuthContainer>
    </div>
  );
};

export default RegisterPage;