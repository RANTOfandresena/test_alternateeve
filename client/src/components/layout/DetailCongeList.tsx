import { useEffect, useState } from "react";
import { fetchUsersFromIds } from "../../api/utilisateur/utilisateur";
import type { DemandeCongeItem } from "../../api/demandeConge";
import { formatDate, formatDateFromDate } from '../../utils/date';
import Modal from "../elements/Modal";
import PageLoader from "../elements/PageLoader";
import DemandeValidationConge from "../conge/DemandeValidationConge";
import DemandeCongeForm from "../DemandeCongeForm";

type DetailsCongeProps = {
  date: Date | null;
  conges: DemandeCongeItem[];
};

export type IUtilisateur = {
  _id: string;
  nom: string;
  email: string;
  genre: string;
  role: string;
  isActive: boolean;
}


const DetailCongeList = ({ date, conges }: DetailsCongeProps) => {
  const [users, setUsers] = useState<Record<string, IUtilisateur>>({});
  const [loading, setLoading] = useState(false);
  const [openModal,setModel] = useState(false)
  const [selectConge,setSelectConge] = useState<DemandeCongeItem | undefined>(undefined)

  useEffect(() => {
    const loadUsers = async () => {
      if (!conges || conges.length === 0) return;

      const ids = conges
        .map((c) => c.employeId)
        .filter((id): id is string => !!id);

      if (ids.length === 0) return;

      setLoading(true);
      try {
        const data: IUtilisateur[] = await fetchUsersFromIds(ids);
        const userMap: Record<string, IUtilisateur> = {};
        data.forEach((u: IUtilisateur) => {
          userMap[u._id] = u;
        });
        setUsers(userMap);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [conges]);
  const saveConge = async (data: DemandeCongeItem): Promise<boolean> => {
    
    return true
  };
  const openModalEditConge = (conge: DemandeCongeItem)=>{
    setSelectConge(conge)
    setModel(true)
  }

  if (!date) {
    return <div className="text-gray-400 italic">Sélectionnez une date</div>;
  }

  const statutStyles = {
    EN_ATTENTE: "bg-yellow-100 text-yellow-800 border border-gray-300",
    ACCEPTE: "bg-green-100 text-green-800 border border-gray-300",
    REFUSE: "bg-red-100 text-red-800 border border-gray-300",
  };

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
          onClose={()=>setModel(false)}
          title="Détail de la demande de congé"
        >
          <DemandeCongeForm
            isValidation={true}
            demande={selectConge}
            onSubmit={saveConge}
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
            const user = c.employeId ? users[c.employeId] : null;

            return (
              <div
                key={c._id}
                className="border-1 border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
                onClick={()=> openModalEditConge(c)}
              >
                {/* Header: employé + statut */}
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-700">
                    {user ? user.nom : c.employeId || "Inconnu"}
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