import { useEffect, useState } from "react";
import { deleteDemandeConge, getAllDemandesCongeFiltre, getMesDemandesConge, updateDemandeConge, type DemandeCongeItem } from '../../api/demandeConge';
import DemandeCongeList from "../../components/DemandeCongeList";
import FiltreDemandesConge from "../../components/elements/FiltreDemandesConge";

const Demande = () => {
    const [demandes, setDemandes] = useState<DemandeCongeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const chargerDemandes = async (params = {}) => {
        try {
            const data = await getAllDemandesCongeFiltre(params);
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
    const deleteDemande = async ( selectCongeId: string ) =>{
        try{
            await deleteDemandeConge(selectCongeId);
            setDemandes((prev) => {
                return prev.filter((p) => p._id !== selectCongeId);
            });
            return true
        } catch{
            return false
        }
    }

    useEffect(() => {
        chargerDemandes();
    }, []);
    return (
        <div className="bg-linear-to-b from-slate-50 to-slate-100 min-h-full">
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