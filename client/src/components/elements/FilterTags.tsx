import { X } from 'lucide-react';

type FilterTagsProps = {
  filters: any;
  onRemoveFilter: (key: string, value: string) => void;
};

const FilterTags = ({ filters, onRemoveFilter }: FilterTagsProps) => {
  const getFilterLabel = (key: string, value: string) => {
    const labels: Record<string, Record<string, string>> = {
      statut: {
        EN_ATTENTE: 'En attente',
        ACCEPTE: 'Accepté',
        REFUSE: 'Refusé',
      },
    };

    if (labels[key] && labels[key][value]) {
      return `${key}: ${labels[key][value]}`;
    }

    if (value) {
      return `${key}: ${value}`;
    }

    return '';
  };

  const activeFilters = Object.entries(filters)
    .filter(([key, value]) => value && value !== 'TOUS' && value !== '')
    .map(([key, value]) => ({
      key,
      value: value as string,
      label: getFilterLabel(key, value as string),
    }));

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm text-slate-500 self-center">Filtres actifs:</span>
      {activeFilters.map(({ key, value, label }) => (
        <span
          key={key}
          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
        >
          {label}
          <button
            onClick={() => onRemoveFilter(key, '')}
            className="hover:text-blue-900"
          >
            <X size={14} />
          </button>
        </span>
      ))}
    </div>
  );
};

export default FilterTags;