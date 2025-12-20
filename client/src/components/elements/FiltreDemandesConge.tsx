import { useState } from "react";
import { Search, Filter, RotateCcw, Calendar, FileText, Clock } from "lucide-react";

type FiltreDemandesCongeProps = {
  onFiltrer: (params: {
    statut?: string;
    type?: string;
    search?: string;
    dateDu?: string;
    dateAu?: string;
  }) => void;
};

const FiltreDemandesConge = ({ onFiltrer }: FiltreDemandesCongeProps) => {
  const [statut, setStatut] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [search, setSearch] = useState('');
  const [dateDu, setDateDu] = useState('');
  const [dateAu, setDateAu] = useState('');

  const handleDateDuChange = (value: string) => {
    setDateDu(value);
    if (dateAu && value > dateAu) {
      setDateAu(value); 
    }
  };

  const handleDateAuChange = (value: string) => {
    setDateAu(value);
    if (dateDu && value < dateDu) {
      setDateDu(value); 
    }
  };

  const appliquer = () => {
    onFiltrer({
      statut: statut || undefined,
      type: type || undefined,
      search: search || undefined,
      dateDu: dateDu || undefined,
      dateAu: dateAu || undefined,
    });
  };

  const reset = () => {
    setStatut('');
    setType('');
    setSearch('');
    setDateDu('');
    setDateAu('');
    onFiltrer({});
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-100 p-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Recherche texte */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Statut */}
        <div className="relative">
          <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            className="pl-8 pr-8 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer"
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="ACCEPTE">Accepté</option>
            <option value="REFUSE">Refusé</option>
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Type de congé */}
        <div className="relative">
          <FileText className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            className="pl-8 pr-8 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white cursor-pointer"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="VACANCES">Vacances</option>
            <option value="MALADIE">Maladie</option>
            <option value="ABSENCE">Absence</option>
          </select>
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Date Du */}
        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            className="pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            value={dateDu}
            onChange={(e) => handleDateDuChange(e.target.value)}
          />
        </div>

        {/* Séparateur */}
        <span className="text-gray-400 text-sm">→</span>

        {/* Date Au */}
        <div className="relative">
          <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="date"
            className="pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            value={dateAu}
            onChange={(e) => handleDateAuChange(e.target.value)}
          />
        </div>
        
        <button 
          onClick={appliquer} 
          className="flex items-center gap-1.5 px-4 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 active:scale-95"
        >
          <Filter className="w-3.5 h-3.5" />
        </button>

        <button 
          onClick={reset} 
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition-all duration-200 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};

export default FiltreDemandesConge;