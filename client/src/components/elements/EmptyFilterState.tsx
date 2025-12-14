import { FilterX } from 'lucide-react';

type EmptyFilterStateProps = {
  onClearFilters: () => void;
};

const EmptyFilterState = ({ onClearFilters }: EmptyFilterStateProps) => {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
        <FilterX className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        Aucune demande correspondante
      </h3>
      <p className="text-slate-600 mb-6 max-w-md mx-auto">
        Aucune demande ne correspond aux filtres sélectionnés. Essayez de modifier vos critères de recherche.
      </p>
      <button
        onClick={onClearFilters}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Réinitialiser tous les filtres
      </button>
    </div>
  );
};

export default EmptyFilterState;