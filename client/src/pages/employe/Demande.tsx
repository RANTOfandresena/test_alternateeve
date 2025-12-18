import { useEffect, useState } from "react";
import { getMesDemandesConge, updateDemandeConge, type DemandeCongeItem } from '../../api/demandeConge';
import DemandeCongeList from "../../components/DemandeCongeList";
import Modal from "../../components/elements/Modal";

const Demande = () => {
    const [demandes, setDemandes] = useState<DemandeCongeItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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
    return (
        <div >
            <DemandeCongeList
              items={demandes}
              loading={loading}
              error={error}
              saveConge={saveConge}
              
            />
        </div>
    );
}
export default Demande;