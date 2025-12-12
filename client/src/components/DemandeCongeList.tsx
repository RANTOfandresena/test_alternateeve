import { useEffect, useState } from 'react';
import { getMesDemandesConge, type DemandeCongeItem } from '../api/demandeConge';
import { formatDate } from '../utils/date';

const statutClasses: Record<DemandeCongeItem['statut'], string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-800 border-amber-200',
  ACCEPTE: 'bg-green-100 text-green-800 border-green-200',
  REFUSE: 'bg-rose-100 text-rose-800 border-rose-200',
};

const DemandeCongeList = () => {
  const [items, setItems] = useState<DemandeCongeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMesDemandesConge();
        setItems(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Impossible de récupérer les demandes.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-6">
        <p className="text-slate-600 text-sm">Chargement des demandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-6">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-6">
        <h3 className="text-lg font-semibold text-slate-900">Mes demandes</h3>
        <p className="mt-2 text-slate-600 text-sm">Aucune demande de congé pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Mes demandes</h3>
        <span className="text-xs text-slate-500">
          Total : {items.length}
        </span>
      </div>
      <div className="mt-4 divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item._id} className="py-3 flex items-start gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">
                  {item.type.toLowerCase().replace('_', ' ')}
                </span>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full border ${statutClasses[item.statut]}`}
                >
                  {item.statut.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-700">
                Du {formatDate(item.dateDebut)} au {formatDate(item.dateFin)}
              </p>
              {item.commentaire && (
                <p className="text-sm text-slate-500">Motif: {item.commentaire}</p>
              )}
            </div>
            <div className="text-xs text-slate-500 whitespace-nowrap">
              Créée le {formatDate(item.dateCreation)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemandeCongeList;