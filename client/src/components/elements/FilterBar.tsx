import { Search, Calendar, X } from 'lucide-react';
import { useState } from 'react';

type FilterBarProps = {
  filters: any;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
};

const FilterBar = ({ filters, onFilterChange, onClearFilters }: FilterBarProps) => {
  const [localSearch, setLocalSearch] = useState(filters.searchText);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange('searchText', localSearch);
  };

  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Recherche texte */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Rechercher
          </label>
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Commentaire, type, employé..."
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </form>
        </div>

        {/* Filtre statut */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Statut
          </label>
          <select
            value={filters.statut}
            onChange={(e) => onFilterChange('statut', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
          >
            <option value="TOUS">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="ACCEPTE">Accepté</option>
            <option value="REFUSE">Refusé</option>
          </select>
        </div>

        {/* Filtre date de début */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Date de début
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.dateDebut}
              onChange={(e) => onFilterChange('dateDebut', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Filtre date de fin */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Date de fin
          </label>
          <div className="relative">
            <input
              type="date"
              value={filters.dateFin}
              onChange={(e) => onFilterChange('dateFin', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* Filtre employé */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Employé
          </label>
          <input
            type="text"
            value={filters.employeId}
            onChange={(e) => onFilterChange('employeId', e.target.value)}
            placeholder="ID ou nom de l'employé"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Filtre type */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Type de congé
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
          >
            <option value="">Tous les types</option>
            <option value="CONGE_ANNUEL">Congé annuel</option>
            <option value="CONGE_MALADIE">Congé maladie</option>
            <option value="RTT">RTT</option>
            <option value="CONGE_SANS_SOLDE">Congé sans solde</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end mt-4 pt-4 border-t border-slate-200">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 flex items-center gap-2"
        >
          <X size={16} />
          Réinitialiser les filtres
        </button>
      </div>
    </div>
  );
};

export default FilterBar;