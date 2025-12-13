import { useEffect, useState } from 'react';
import { getAllDemandesConge, accepterDemandeConge, refuserDemandeConge, type DemandeCongeItem } from '../api/demandeConge';
import { formatDate } from '../utils/date';

const statutClasses: Record<DemandeCongeItem['statut'], string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-800 border-amber-200',
  ACCEPTE: 'bg-green-100 text-green-800 border-green-200',
  REFUSE: 'bg-rose-100 text-rose-800 border-rose-200',
};

const ManagerDemandes = () => {
  const [items, setItems] = useState<DemandeCongeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDemandesConge();
        setItems(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Impossible de récupérer les demandes.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAccepter = async (id: string) => {
    try {
      const updated = await accepterDemandeConge(id);
      setItems((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de l\'acceptation');
    }
  };

  const handleRefuser = async (id: string) => {
    try {
      const updated = await refuserDemandeConge(id);
      setItems((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors du refus');
    }
  };

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
        <h3 className="text-lg font-semibold text-slate-900">Demandes de congé</h3>
        <p className="mt-2 text-slate-600 text-sm">Aucune demande de congé pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Demandes de congé</h3>
        <span className="text-xs text-slate-500">Total : {items.length}</span>
      </div>
      <div className="mt-4 divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item._id} className="py-3 flex items-start gap-4">
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">{item.type.toLowerCase().replace('_', ' ')}</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${statutClasses[item.statut]}`}>
                  {item.statut.replace('_', ' ')}
                </span>
              </div>
              <p className="text-sm text-slate-700">Du {formatDate(item.dateDebut)} au {formatDate(item.dateFin)}</p>
              {item.commentaire && (
                <p className="text-sm text-slate-500">Motif: {item.commentaire}</p>
              )}
              {item.employeId && (
                <p className="text-sm text-slate-500">Employé: {item.employeId}</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-xs text-slate-500 whitespace-nowrap">Créée le {formatDate(item.dateCreation)}</div>
              {item.statut === 'EN_ATTENTE' && (
                <div className="flex gap-2">
                  <button onClick={() => handleAccepter(item._id)} className="px-3 py-1 text-xs rounded bg-green-600 text-white">Accepter</button>
                  <button onClick={() => handleRefuser(item._id)} className="px-3 py-1 text-xs rounded bg-rose-600 text-white">Refuser</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerDemandes;
