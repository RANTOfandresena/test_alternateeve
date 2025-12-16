import { useEffect, useState } from 'react';
import { accepterDemandeConge, getAllDemandesConge, refuserDemandeConge} from '../../api/demandeConge';
import ManagerDemandes from '../../components/ManagerDemandes';


export type DemandeCongeItem = {
  _id?: string;
  type: "VACANCES" | "MALADIE" | "MATERNITE" | "PATERNITE" | "FAMILIAL";
  dateDebut: string;
  dateFin: string;
  commentaire?: string;
  statut?: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';
  dateCreation?: string;
  employeId?: string;
};

const Demande = () => {
  const [demandes, setDemandes] = useState<DemandeCongeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDemandesConge();
        setDemandes(data);
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
      setDemandes((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors de l\'acceptation');
    }
  };

  const handleRefuser = async (id: string) => {
    try {
      const updated = await refuserDemandeConge(id);
      setDemandes((prev) => prev.map((it) => (it._id === updated._id ? updated : it)));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur lors du refus');
    }
  };

  return (
    <div className="bg-linear-to-b from-slate-50 to-slate-100 min-h-full">
        <section className="flex justify-center">
          <ManagerDemandes
            demandes={demandes}
            loading={loading}
            error={error}
            onAccepter={handleAccepter}
            onRefuser={handleRefuser}
          />
        </section>
    </div>
  );
};

export default Demande;

