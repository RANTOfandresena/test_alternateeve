import { useEffect, useState } from 'react';
import { accepterDemandeConge, getAllDemandesConge, refuserDemandeConge, type DemandeCongeItem} from '../../api/demandeConge';
import DemandeCongeList from '../../components/DemandeCongeList';
import FiltreDemandesConge from '../../components/elements/FiltreDemandesConge';

const Demande = () => {
  const [demandes, setDemandes] = useState<DemandeCongeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDemandes = async (params = {}) => {
    setLoading(true);
    try {
      const data = await getAllDemandesConge(params);
      setDemandes(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Impossible de récupérer les demandes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);
  const handleAccepter = async (id: string) => {
    try {
      const updated = await accepterDemandeConge(id);
      setDemandes((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
      return updated;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de l\'acceptation');
      throw err;
    }
  };

  const handleRefuser = async (id: string) => {
    try {
      const updated = await refuserDemandeConge(id);
      setDemandes((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
      return updated;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors du refus');
      throw err;
    }
  };
  const saveConge = async (payload: DemandeCongeItem) => {
    return payload.statut === 'ACCEPTE'
      ? handleAccepter(payload._id!)
      : handleRefuser(payload._id!);
  };

  return (
    <div className="bg-linear-to-b from-slate-50 to-slate-100 min-h-full">
      <section className="flex flex-col items-center gap-6">
        
        <FiltreDemandesConge onFiltrer={fetchDemandes} />

        <div className="w-full max-h-[400px] overflow-y-auto">
          <DemandeCongeList
            items={demandes}
            loading={loading}
            error={error}
            saveConge={saveConge}
            onDeleteDemande={async () => false}
          />
        </div>
      </section>
    </div>
  );
};

export default Demande;

