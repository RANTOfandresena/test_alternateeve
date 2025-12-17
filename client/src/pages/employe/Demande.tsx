import { useEffect, useState } from "react";
import { getMesDemandesConge, type DemandeCongeItem } from '../../api/demandeConge';
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

    useEffect(() => {
        chargerDemandes();
    }, []);
    return (
        <div >
            <DemandeCongeList
              items={demandes}
              loading={loading}
              error={error}
            />
        </div>
    );
}
export default Demande;