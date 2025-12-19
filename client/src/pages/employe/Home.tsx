import { useEffect, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { creerDemandeConge, deleteDemandeConge, getMesDemandesConge, updateDemandeConge, type DemandeCongeItem, type DemandeCongePayload } from '../../api/demandeConge';
import DemandeCongeForm from '../../components/DemandeCongeForm';
import DemandeCongeList from '../../components/DemandeCongeList';
import StatistiquesConge from '../../components/StatistiquesConge';
import { useAppSelector } from '../../hooks/hooks';
import { calculerStatistiques } from '../../utils/statistiquesUtils';
import Modal from '../../components/elements/Modal';
import CalendrierConge from '../../components/elements/CalendrierConge';

const HomePage = () => {
  const { user } = useAppSelector((state) => state.auth);

  const [demandes, setDemandes] = useState<DemandeCongeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const chargerDemandes = async () => {
    try {
      const data = await getMesDemandesConge();
      setDemandes(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };
  const saveConge = async (data: DemandeCongeItem): Promise<DemandeCongeItem> => {
      if (!data._id) throw new Error("ID manquant");

      const response = await updateDemandeConge(data._id, data);
      if (!response) throw new Error("Impossible de mettre à jour la demande");

      setDemandes(prev =>
          prev.map(d =>
              d._id === response._id
                  ? response
                  : d
          )
      );

      return response;
  };

  useEffect(() => {
    chargerDemandes();
  }, []);

  const creerDemande = async (payload: DemandeCongeItem) => {
    const response = await creerDemandeConge(payload);
    setDemandes((prev) => [response, ...prev]);
    setOpenModal(false);
    return response;
  };
  const deleteDemande = async ( selectCongeId: string ) =>{
      try{
          console.log("okok")
          await deleteDemandeConge(selectCongeId);
          setDemandes((prev) => {
              return prev.filter((p) => p._id !== selectCongeId);
          });
          return true
      } catch{
          return false
      }
  }

  // Calcul des statistiques à partir des demandes
  const statistiques = calculerStatistiques(demandes);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="px-4 py-10 md:py-14">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Bouton ouverture modal */}
          <section className="flex justify-center">
            <button
              onClick={() => setOpenModal(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-semibold shadow-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              Nouvelle demande de congé
            </button>
          </section>

          {/* Modal formulaire */}
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            title="Nouvelle demande de congé"
          >
            <DemandeCongeForm
              onSubmit={creerDemande}
              
            />
          </Modal>

          {/* Section Statistiques */}
          <section className="flex justify-center">
            <StatistiquesConge stats={statistiques} />
          </section>
          {/* Section Liste des demandes */}
          <section className="flex justify-center">
            <DemandeCongeList
              items={demandes}
              loading={loading}
              error={error}
              saveConge={saveConge}
              onDeleteDemande={deleteDemande}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default HomePage;