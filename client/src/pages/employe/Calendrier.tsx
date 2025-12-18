import { useEffect, useState } from "react";
import CalendrierConge from "../../components/elements/CalendrierConge";
import { getMesDemandesConge, type DemandeCongeItem } from "../../api/demandeConge";
import DetailCongeList from "../../components/layout/DetailCongeList";
import PanelContainer from "../../components/layout/PannelContainner";
import { userInDate } from "../../utils/date";

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
    getMesDemandesConge().then(setDemandes);
  }, []);

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
        />
      </PanelContainer>
    </div>
  );
};

export default Calendrier;