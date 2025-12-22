import { useEffect, useState } from "react";
import { creerDemandeConge, deleteDemandeConge, getAllDemandesCongeFiltre, getMesDemandesConge, updateDemandeConge, type DemandeCongeItem } from '../../api/demandeConge';
import DemandeCongeList from "../../components/DemandeCongeList";
import FiltreDemandesConge from "../../components/elements/FiltreDemandesConge";
import { Plus } from "lucide-react";
import Modal from "../../components/elements/Modal";
import DemandeCongeForm from "../../components/DemandeCongeForm";
import { toast } from "react-toastify";

const Demande = () => {
    const [demandes, setDemandes] = useState<DemandeCongeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const chargerDemandes = async (params = {}) => {
    try {
        const data = await getAllDemandesCongeFiltre(params);
        setDemandes(data);
    } catch (err: any) {
        toast.error(
        err?.response?.data?.message || "Erreur de chargement des demandes"
        );
    } finally {
        setLoading(false);
    }
    };
    const creerDemande = async (payload: DemandeCongeItem) => {
    try {
        const response = await creerDemandeConge(payload);

        setDemandes((prev) => [response, ...prev]);
        setOpenModal(false);

        toast.success("Demande de congé créée avec succès");
        return response;
    } catch (error: any) {
        toast.error(
        error?.response?.data?.message ||
            "Erreur lors de la création de la demande"
        );
        throw error;
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
    const deleteDemande = async (selectCongeId: string) => {
        try {
            await deleteDemandeConge(selectCongeId);

            setDemandes(prev =>
            prev.filter(p => p._id !== selectCongeId)
            );

            toast.success("Demande de congé supprimée avec succès");
            return true;
        } catch (error: any) {
            toast.error(
            error?.response?.data?.message ||
                "Erreur lors de la suppression de la demande"
            );
            return false;
        }
    };

    useEffect(() => {
        chargerDemandes();
    }, []);
    return (
        <div className="bg-linear-to-b from-slate-50 to-slate-100 min-h-full">
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

            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title="Nouvelle demande de congé"
                >
                <DemandeCongeForm onSubmit={creerDemande} />
            </Modal>
            <section className="flex flex-col items-center gap-6">
            <FiltreDemandesConge onFiltrer={chargerDemandes} />
            <div className="w-full max-h-[400px] overflow-y-auto">
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
    );
}
export default Demande;