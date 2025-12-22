import { useEffect, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { creerDemandeConge, deleteDemandeConge, getMesDemandesConge, updateDemandeConge, type DemandeCongeItem, type DemandeCongePayload } from '../../api/demandeConge';
import DemandeCongeForm from '../../components/DemandeCongeForm';
import DemandeCongeList from '../../components/DemandeCongeList';
import StatistiquesConge from '../../components/StatistiquesConge';
import Modal from '../../components/elements/Modal';
import { getProfilUtilisateur, type ProfilUtilisateur } from '../../api/utilisateur/utilisateur';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [profil, setProfil] = useState<ProfilUtilisateur | null>(null);
  const [demandes, setDemandes] = useState<DemandeCongeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);

  const fetchProfil = async () => {
    try {
      setLoading(true);
      const data = await getProfilUtilisateur();
      setProfil(data);
    } catch (e: any) {
      console.error(e);
      toast.error(
        e?.response?.data?.message ||
          "Erreur lors du chargement du profil"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    if(openModal) return
    fetchProfil()
  },[demandes])
  const chargerDemandes = async () => {
    try {
      const data = await getMesDemandesConge();
      setDemandes(data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Erreur lors du chargement des demandes"
      );
    } finally {
      setLoading(false);
    }
  };
  const saveConge = async (
    data: DemandeCongeItem
  ): Promise<DemandeCongeItem> => {
    try {
      if (!data._id) throw new Error("ID manquant");

      const response = await updateDemandeConge(data._id, data);
      if (!response) throw new Error("Impossible de mettre à jour la demande");

      setDemandes(prev =>
        prev.map(d =>
          d._id === response._id ? response : d
        )
      );

      toast.success("Demande de congé mise à jour avec succès");
      return response;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Erreur lors de la mise à jour de la demande"
      );
      throw error;
    }
  };

  useEffect(() => {
    chargerDemandes();
    fetchProfil();
  }, []);

  const creerDemande = async (payload: DemandeCongeItem) => {
    try {
      const response = await creerDemandeConge(payload);
      setDemandes(prev => [response, ...prev]);
      setOpenModal(false);
      toast.success("Demande de congé créée avec succès");
      return response;
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Erreur lors de la création de la demande"
      );
      throw error;
    }
  };
  const deleteDemande = async (selectCongeId: string) => {
    try {
      await deleteDemandeConge(selectCongeId);

      setDemandes(prev =>
        prev.filter(p => p._id !== selectCongeId)
      );

      toast.success("Demande de congé supprimée avec succès");
      return true;
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Erreur lors de la suppression de la demande"
      );
      return false;
    }
  };

  return (
    <div className="flex-1 overflow-auto"> 
      <div className="px-4 py-10 md:py-14 min-h-0">
        <div className="max-w-5xl mx-auto space-y-8">
          

          <button
            onClick={() => setOpenModal(true)}
            className="group fixed bottom-6 right-6 flex items-center w-14 h-14 rounded-xl bg-blue-600 text-white shadow-lg overflow-hidden transition-all duration-150 hover:w-60"
          >
            <div className="flex items-center justify-center w-14 h-14 flex-shrink-0">
                <Plus className="w-6 h-6" />
            </div>

            <span className="pr-4 text-xs font-medium whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                Nouvelle demande de congé
            </span>
          </button>

          {/* Modal formulaire */}
          <Modal
            open={openModal}
            onClose={() => setOpenModal(false)}
            title="Nouvelle demande de congé"
          >
            <DemandeCongeForm onSubmit={creerDemande} />
          </Modal>

          {/* Section Statistiques */}
          <section className="flex justify-center">
            {profil && <StatistiquesConge stats={profil} />}
          </section>

          {/* Section Liste des demandes */}
          <section className="flex justify-center">
            <div className="w-full max-h-[600px] overflow-auto">
              <DemandeCongeList
                items={demandes}
                loading={loading}
                error={error}
                saveConge={saveConge}
                onDeleteDemande={deleteDemande}
              />
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default HomePage;