import { useEffect, useState } from "react";
import CalendrierConge from "../../components/elements/CalendrierConge";
import { getAllDemandesConge, type DemandeCongeItem } from "../../api/demandeConge";
import DetailCongeList from "../../components/layout/DetailCongeList";
import PanelContainer from "../../components/layout/PannelContainner";

const Calendrier = () => {
  const [demandes, setDemandes] = useState<DemandeCongeItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [matchedConges, setMatchedConges] = useState<DemandeCongeItem[]>([]);
  const [openPannel,setOpenPannel] = useState<boolean>(false)

  const dateSelected = (date: Date, matched: DemandeCongeItem[]) => {
    setSelectedDate(date);
    setMatchedConges(matched);
    setOpenPannel(true)
  };

  useEffect(() => {
    getAllDemandesConge().then(setDemandes);
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
        />
      </PanelContainer>
    </div>
  );
};

export default Calendrier;