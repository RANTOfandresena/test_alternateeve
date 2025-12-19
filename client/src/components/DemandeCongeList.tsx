import { useState } from 'react';
import { deleteDemandeConge, type DemandeCongeItem } from '../api/demandeConge';
import { formatDate } from '../utils/date';
import DemandeCongeForm from './DemandeCongeForm';
import Modal from './elements/Modal';
import PageLoader from './elements/PageLoader';
import { statutStyles } from './layout/DetailCongeList';

export const statutClasses: Record<any, string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-800 border-amber-200',
  ACCEPTE: 'bg-green-100 text-green-800 border-green-200',
  REFUSE: 'bg-rose-100 text-rose-800 border-rose-200',
};

interface Props {
  items: DemandeCongeItem[];
  loading: boolean;
  error: string | null;
  saveConge: (payload: DemandeCongeItem) => Promise<DemandeCongeItem>;
  onDeleteDemande: (id: string) => Promise<boolean>
}

const DemandeCongeList = ({ items, loading, error, saveConge, onDeleteDemande }: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [selectConge,setSelectConge] = useState<DemandeCongeItem | undefined>(undefined)

  const passSaveConge = async (payload: DemandeCongeItem) => {
    const result = await saveConge(payload);

    if (result) {
      setOpenModal(false);
    }
    return result;
  };

  const handleClick = (item: DemandeCongeItem)=>{
    setSelectConge(item)
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

  if (loading) {
    return (
      <PageLoader/>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-6">
        <p className="text-red-700 text-sm">{error}</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-6">
        <h3 className="text-lg font-semibold text-slate-900">Demandes</h3>
        <p className="mt-2 text-slate-600 text-sm">Aucune demande de congé pour le moment.</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl shadow-slate-200/80 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Demandes</h3>
          <span className="text-xs text-slate-500">
            Total : {items.length}
          </span>
        </div>
        <div className="mt-4 divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item._id} className="py-3 flex items-start gap-4" onClick={() =>handleClick(item)}>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {item.type?.toLowerCase().replace('_', ' ')}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full border ${item.statut && statutClasses[item.statut]}`}
                  >
                    {item.statut?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-sm text-slate-700">
                  Du {formatDate(item.dateDebut)} au {formatDate(item.dateFin)}
                </p>
                {item.commentaire && (
                  <p className="text-sm text-slate-500">Motif: {item.commentaire}</p>
                )}
              </div>
              {item.dateCreation && <div className="text-xs text-slate-500 whitespace-nowrap">
                Créée le {formatDate(item.dateCreation)}
              </div>}
            </div>
          ))}
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={()=>setOpenModal(false)}
        headerRight={
          <span
            className={`text-sm font-medium px-3 py-1 rounded-full ${selectConge?.statut && statutStyles[selectConge.statut]}`}
          >
            {selectConge?.statut?.replace("_", " ")}
          </span>
        }
        title="Demande de Congé"
        >
        <DemandeCongeForm
          demande={selectConge}
          onSubmit={passSaveConge}
          onDeleteDemande={deleteDemande}
        />
      </Modal>
    </>
  );
};

export default DemandeCongeList;