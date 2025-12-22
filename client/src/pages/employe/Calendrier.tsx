import { useEffect, useState } from "react";
import CalendrierConge from "../../components/elements/CalendrierConge";
import { deleteDemandeConge, getMesDemandesConge, type DemandeCongeItem } from "../../api/demandeConge";
import DetailCongeList from "../../components/layout/DetailCongeList";
import PanelContainer from "../../components/layout/PannelContainner";
import { userInDate } from "../../utils/date";
import { toast } from "react-toastify";

const Calendrier = () => {
  const [demandes, setDemandes] = useState<DemandeCongeItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [matchedConges, setMatchedConges] = useState<DemandeCongeItem[]>([]);
  const [openPannel,setOpenPannel] = useState<boolean>(false)

  const dateSelected = (date: Date) => {
    setSelectedDate(date);
    const matched = userInDate(date,demandes)
    setMatchedConges(matched);
    setOpenPannel(true)
  };
  const upDateDemande = (updatedDemande: DemandeCongeItem) => {
    setDemandes(prev =>
      prev.map(d => (d._id === updatedDemande._id ? { ...d, ...updatedDemande } : d))
    );
    setMatchedConges(prev =>
      prev.map(d => (d._id === updatedDemande._id ? { ...d, ...updatedDemande } : d))
    );
  };

  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const data = await getMesDemandesConge();
        setDemandes(data);
      } catch (err) {
        console.error(err);
        toast.error("Impossible de récupérer les demandes de congé.");
      }
    };

    fetchDemandes();
  }, []);

  const deleteDemande = async (selectCongeId: string) => {
    try {
      await deleteDemandeConge(selectCongeId);

      setDemandes((prev) =>
        prev.filter((p) => p._id !== selectCongeId)
      );

      setMatchedConges((prev) =>
        prev.filter((p) => p._id !== selectCongeId)
      );

      toast.success("Demande de congé supprimée avec succès");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression de la demande");
      return false;
    }
  };

  return (
    <div className="flex gap-6">
      {/* Calendrier */}
      <div className="flex-1">
        <CalendrierConge
          conge={demandes}
          dateSelected={dateSelected}
        />
      </div>

      <PanelContainer
        title="List des congés"
        isOpen={openPannel}
        onClose={()=>setOpenPannel(false)}
      >
        <DetailCongeList
          date={selectedDate}
          conges={matchedConges}
          onUpdate={upDateDemande}
          onDeleteDemande={deleteDemande}
        />
      </PanelContainer>
    </div>
  );
};

export default Calendrier;