import { useState, useEffect, useMemo } from 'react';
import { type DemandeCongeItem } from '../api/demandeConge';
import { formatDate, isDateInRange } from '../utils/date';
import FilterBar from './elements/FilterBar';
import FilterTags from './elements/FilterTags';
import DemandCard from './elements/DemandCard';
import EmptyFilterState from './elements/EmptyFilterState';
import StatsOverview from './elements/StatsOverview';
import LoadingOverlay from './elements/LoadingOverlay';
import { Search, Filter, Calendar, Download } from 'lucide-react';

const statutClasses: Record<DemandeCongeItem['statut'], string> = {
  EN_ATTENTE: 'bg-amber-100 text-amber-800 border-amber-200',
  ACCEPTE: 'bg-green-100 text-green-800 border-green-200',
  REFUSE: 'bg-rose-100 text-rose-800 border-rose-200',
};

const statutLabels: Record<DemandeCongeItem['statut'], string> = {
  EN_ATTENTE: 'En attente',
  ACCEPTE: 'Accepté',
  REFUSE: 'Refusé',
};

type ManagerDemandesProps = {
  demandes: DemandeCongeItem[];
  loading: boolean;
  error: string | null;
  onAccepter: (id: string) => void | Promise<void>;
  onRefuser: (id: string) => void | Promise<void>;
};

type Filters = {
  statut: DemandeCongeItem['statut'] | 'TOUS';
  dateDebut: string;
  dateFin: string;
  employeId: string;
  type: string;
  searchText: string;
};

const ManagerDemandes = ({ demandes, loading, error, onAccepter, onRefuser }: ManagerDemandesProps) => {
  const [filters, setFilters] = useState<Filters>({
    statut: 'TOUS',
    dateDebut: '',
    dateFin: '',
    employeId: '',
    type: '',
    searchText: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedDemandes, setSelectedDemandes] = useState<Set<string>>(new Set());

  // Calculate statistics
  const stats = useMemo(() => {
    const total = demandes.length;
    const enAttente = demandes.filter(d => d.statut === 'EN_ATTENTE').length;
    const acceptees = demandes.filter(d => d.statut === 'ACCEPTE').length;
    const refusees = demandes.filter(d => d.statut === 'REFUSE').length;
    return { total, enAttente, acceptees, refusees };
  }, [demandes]);

  // Filter demandes based on filters
  const filteredDemandes = useMemo(() => {
    return demandes.filter(demande => {
      // Filter by status
      if (filters.statut !== 'TOUS' && demande.statut !== filters.statut) {
        return false;
      }

      // Filter by date range
      if (filters.dateDebut && filters.dateFin) {
        const isInRange = isDateInRange(
          demande.dateDebut,
          demande.dateFin,
          filters.dateDebut,
          filters.dateFin
        );
        if (!isInRange) return false;
      }

      // Filter by employee
      if (filters.employeId && !demande.employeId?.includes(filters.employeId)) {
        return false;
      }

      // Filter by type
      if (filters.type && demande.type !== filters.type) {
        return false;
      }

      // Filter by search text
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesCommentaire = demande.commentaire?.toLowerCase().includes(searchLower);
        const matchesType = demande.type.toLowerCase().includes(searchLower);
        const matchesEmployee = demande.employeId?.toLowerCase().includes(searchLower);
        
        if (!matchesCommentaire && !matchesType && !matchesEmployee) {
          return false;
        }
      }

      return true;
    });
  }, [demandes, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key as keyof Filters]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      statut: 'TOUS',
      dateDebut: '',
      dateFin: '',
      employeId: '',
      type: '',
      searchText: ''
    });
  };

  const handleSelectAll = () => {
    if (selectedDemandes.size === filteredDemandes.length) {
      setSelectedDemandes(new Set());
    } else {
      setSelectedDemandes(new Set(filteredDemandes.map(d => d._id)));
    }
  };

  const handleExportSelection = () => {
    const selected = filteredDemandes.filter(d => selectedDemandes.has(d._id));
    // Implement export logic here
    console.log('Exporting:', selected);
  };

  const activeFiltersCount = Object.values(filters).filter(
    value => value && value !== 'TOUS'
  ).length;

  if (loading) {
    return <LoadingOverlay />;
  }

  if (error) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Erreur de chargement</h3>
          <p className="text-red-700 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header avec stats et actions */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">Gestion des demandes</h3>
            <p className="text-sm text-slate-500 mt-1">
              {filteredDemandes.length} demande{filteredDemandes.length !== 1 ? 's' : ''} trouvée{filteredDemandes.length !== 1 ? 's' : ''}
              {demandes.length !== filteredDemandes.length && ` sur ${demandes.length}`}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedDemandes.size > 0 && (
              <button
                onClick={handleExportSelection}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Download size={16} />
                Exporter ({selectedDemandes.size})
              </button>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 text-sm"
            >
              <Filter size={16} />
              Filtres {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="mt-6">
          <StatsOverview stats={stats} />
        </div>

        {/* Barre de filtres */}
        {showFilters && (
          <div className="mt-6">
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
        )}

        {/* Tags des filtres actifs */}
        {activeFiltersCount > 0 && (
          <div className="mt-4">
            <FilterTags filters={filters} onRemoveFilter={handleFilterChange} />
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="p-6">
        {!demandes.length ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-50 flex items-center justify-center">
              <span className="text-3xl">📋</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Aucune demande de congé
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Aucune demande de congé n'a été soumise pour le moment.
            </p>
          </div>
        ) : !filteredDemandes.length ? (
          <EmptyFilterState onClearFilters={handleClearFilters} />
        ) : (
          <div>
            {/* Sélection multiple */}
            <div className="flex items-center justify-between mb-4 p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedDemandes.size === filteredDemandes.length && filteredDemandes.length > 0}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300"
                />
                <span className="text-sm text-slate-600">
                  {selectedDemandes.size > 0 
                    ? `${selectedDemandes.size} sélectionnée(s)` 
                    : 'Sélectionner tout'}
                </span>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>Trier par:</span>
                <select className="bg-transparent border-0 focus:ring-0 text-slate-700">
                  <option value="dateCreation">Date de création</option>
                  <option value="dateDebut">Date de début</option>
                  <option value="statut">Statut</option>
                </select>
              </div>
            </div>

            {/* Liste des demandes */}
            <div className="space-y-3">
              {filteredDemandes.map((item) => (
                <DemandCard
                  key={item._id}
                  demande={item}
                  isSelected={selectedDemandes.has(item._id)}
                  onToggleSelect={() => {
                    const newSelected = new Set(selectedDemandes);
                    if (newSelected.has(item._id)) {
                      newSelected.delete(item._id);
                    } else {
                      newSelected.add(item._id);
                    }
                    setSelectedDemandes(newSelected);
                  }}
                  onAccepter={onAccepter}
                  onRefuser={onRefuser}
                  statutClasses={statutClasses}
                  statutLabels={statutLabels}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerDemandes;