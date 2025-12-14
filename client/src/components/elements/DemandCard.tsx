import { Check, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/date';

type DemandCardProps = {
  demande: any;
  isSelected: boolean;
  onToggleSelect: () => void;
  onAccepter: (id: string) => void;
  onRefuser: (id: string) => void;
  statutClasses: Record<string, string>;
  statutLabels: Record<string, string>;
};

const DemandCard = ({
  demande,
  isSelected,
  onToggleSelect,
  onAccepter,
  onRefuser,
  statutClasses,
  statutLabels,
}: DemandCardProps) => {
  const getStatusIcon = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'ACCEPTE':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'REFUSE':
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`border rounded-xl p-4 hover:shadow-md transition-shadow ${
      isSelected ? 'border-blue-300 bg-blue-50' : 'border-slate-200'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4 mt-1 text-blue-600 rounded border-slate-300"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="font-medium text-slate-900 capitalize">
                {demande.type.toLowerCase().replace('_', ' ')}
              </h4>
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${
                statutClasses[demande.statut]
              }`}>
                {getStatusIcon(demande.statut)}
                {statutLabels[demande.statut]}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-slate-600">
              <div>
                <span className="text-slate-500">Période: </span>
                <span className="font-medium">
                  {formatDate(demande.dateDebut)} → {formatDate(demande.dateFin)}
                </span>
              </div>
              
              <div>
                <span className="text-slate-500">Employé: </span>
                <span className="font-medium">{demande.employeId || 'Non spécifié'}</span>
              </div>
              
              <div>
                <span className="text-slate-500">Créé le: </span>
                <span className="font-medium">{formatDate(demande.dateCreation)}</span>
              </div>
            </div>

            {demande.commentaire && (
              <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Motif:</span> {demande.commentaire}
                </p>
              </div>
            )}
          </div>
        </div>

        {demande.statut === 'EN_ATTENTE' && (
          <div className="flex flex-col gap-2 ml-4">
            <button
              onClick={() => onAccepter(demande._id)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Accepter
            </button>
            <button
              onClick={() => onRefuser(demande._id)}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              Refuser
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandCard;