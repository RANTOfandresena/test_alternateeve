import { useEffect, useState } from "react";
import { fetchUsersFromIds } from "../../api/utilisateur/utilisateur";
import { accepterDemandeConge, refuserDemandeConge, updateDemandeConge, type DemandeCongeItem } from "../../api/demandeConge";
import { formatDate, formatDateFromDate } from '../../utils/date';
import Modal from "../elements/Modal";
import PageLoader from "../elements/PageLoader";
import DemandeCongeForm from "../DemandeCongeForm";
import { useAppSelector } from "../../hooks/hooks";
import { toast } from "react-toastify";

type DetailsCongeProps = {
  date: Date | null;
  conges: DemandeCongeItem[];
  onUpdate: (data: DemandeCongeItem) => void;
  onDeleteDemande: (id: string) => Promise<boolean>
};

export type IUtilisateur = {
  _id: string;
  nom: string;
  email: string;
  role: string;
  isActive: boolean;
}
export const statutStyles = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-800 border border-gray-300",
  ACCEPTE: "bg-green-100 text-green-800 border border-gray-300",
  REFUSE: "bg-red-100 text-red-800 border border-gray-300",
};

const DetailCongeList = ({ date, conges, onUpdate, onDeleteDemande}: DetailsCongeProps) => {
  const { isPageManager } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [openModal,setOpenModal] = useState(false)
  const [selectConge,setSelectConge] = useState<DemandeCongeItem | undefined>(undefined)

  const saveConge = async (
    data: DemandeCongeItem
  ): Promise<DemandeCongeItem> => {
    try {
      let response;

      if (isPageManager) {
        if (data.statut === "ACCEPTE") {
          response = await accepterDemandeConge(data._id!);
          toast.success("Demande de congé acceptée");
        } else {
          response = await refuserDemandeConge(data._id!);
          toast.success("Demande de congé refusée");
        }
      } else {
        response = await updateDemandeConge(data._id!, data);
        toast.success("Demande de congé mise à jour");
      }

      onUpdate(response);
      setOpenModal(false);
      return response;
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de l'enregistrement de la demande");
      throw error; 
    }
  };
  const openModalEditConge = (conge: DemandeCongeItem)=>{
    setSelectConge(conge)
    setOpenModal(true)
  }
  const deleteDemande = async () =>{
    if(!selectConge?._id) return false
    const isDelete = await onDeleteDemande(selectConge?._id)
    if(isDelete){
      setOpenModal(false)
      return true
    }
    return false
  }

  if (!date) {
    return <div className="text-gray-400 italic">Sélectionnez une date</div>;
  }



  if (loading) {
    return (
      <PageLoader/>
    );
  }

  return (
    <div>
      {selectConge && openModal &&
        <Modal
          open={openModal}
          onClose={()=>setOpenModal(false)}
          headerRight={
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${selectConge.statut && statutStyles[selectConge.statut]}`}
            >
              {selectConge.statut?.replace("_", " ")}
            </span>
          }
          title={
            <div className="flex flex-col text-left">
              <span className="font-medium text-slate-900">{selectConge.employeId?.nom}</span>
              <span className="text-xs text-slate-500">{selectConge.employeId?.email}</span>
            </div>
          }
        >
          <DemandeCongeForm
            isValidation={isPageManager}
            demande={selectConge}
            onSubmit={saveConge}
            onDeleteDemande={deleteDemande}
          />
        </Modal>
        
      }
      <h2 className="font-bold text-xl mb-4 text-gray-800">
        {formatDateFromDate(date)}
      </h2>

      {conges.length === 0 ? (
        <p className="text-gray-500">Aucun congé ce jour</p>
      ) : (
        <div className="space-y-3">
          {conges.map((c) => {
            return (
              <div
                key={c._id}
                className="border-1 border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                onClick={()=> openModalEditConge(c)}
              >
                {/* Header: employé + statut */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-700">
                    {c.employeId?.nom}
                  </span>
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${c.statut && statutStyles[c.statut]}`}
                  >
                    {c.statut?.replace("_", " ")}
                  </span>
                </div>

                {/* Tags pour type et dates */}
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                    Type: {c.type}
                  </span>
                  <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                    {formatDate(c.dateDebut)} → {formatDate(c.dateFin)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DetailCongeList;