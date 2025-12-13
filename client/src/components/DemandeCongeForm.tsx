import { useState, type FormEvent } from 'react';
import { creerDemandeConge, type DemandeCongePayload } from '../api/demandeConge';

type LeaveType = DemandeCongePayload['type'];

interface LeaveRequestFormState {
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

const initialState: LeaveRequestFormState = {
  type: 'VACANCES',
  startDate: '',
  endDate: '',
  reason: '',
};

interface Props {
  onSubmit: (payload: DemandeCongePayload) => Promise<boolean>;
}

const DemandeCongeForm = ({ onSubmit }: Props) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await onSubmit({
        type: form.type,
        dateDebut: form.startDate,
        dateFin: form.endDate,
        commentaire: form.reason || undefined,
      });
      setSubmitted(response);
      setForm(initialState);
    } catch {
      setError('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };
  const handleChange = <K extends keyof LeaveRequestFormState>(key: K, value: LeaveRequestFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Nouvelle demande</h2>
        <p className="text-slate-600 text-sm">
          Renseignez les détails de votre demande de congé. Vous recevrez une confirmation par votre manager.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
          Type de congé
          <select
            value={form.type}
            onChange={(e) => handleChange('type', e.target.value as LeaveType)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="VACANCES">Vacances</option>
            <option value="MALADIE">Maladie</option>
            <option value="MATERNITE">Maternité</option>
            <option value="PATERNITE">Paternité</option>
            <option value="FAMILIAL">Familial</option>
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
          Date de début
          <input
            type="date"
            required
            value={form.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-slate-800">
          Date de fin
          <input
            type="date"
            required
            value={form.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </label>

        <label className="md:col-span-2 flex flex-col gap-2 text-sm font-semibold text-slate-800">
          Motif
          <textarea
            required
            rows={4}
            value={form.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            placeholder="Ex: Vacances familiales"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
          />
        </label>

        {error && (
          <p className="md:col-span-2 rounded-xl bg-red-50 text-red-700 px-3 py-2 text-sm">
            {error}
          </p>
        )}
        {submitted && !error && (
          <p className="md:col-span-2 rounded-xl bg-green-50 text-green-700 px-3 py-2 text-sm">
            Demande enregistrée. Elle sera traitée par votre manager.
          </p>
        )}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="rounded-xl bg-linear-to-r from-blue-500 to-blue-600 text-white font-semibold px-6 py-3 hover:shadow-lg hover:shadow-blue-500/30 transition disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Envoyer la demande'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DemandeCongeForm;
