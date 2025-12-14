import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

type StatsOverviewProps = {
  stats: {
    total: number;
    enAttente: number;
    acceptees: number;
    refusees: number;
  };
};

const StatsOverview = ({ stats }: StatsOverviewProps) => {
  const statItems = [
    {
      label: 'Total',
      value: stats.total,
      color: 'bg-blue-100 text-blue-800',
      icon: Calendar
    },
    {
      label: 'En attente',
      value: stats.enAttente,
      color: 'bg-amber-100 text-amber-800',
      icon: Clock
    },
    {
      label: 'Acceptées',
      value: stats.acceptees,
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    },
    {
      label: 'Refusées',
      value: stats.refusees,
      color: 'bg-rose-100 text-rose-800',
      icon: XCircle
    }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {statItems.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${stat.color}`}
          >
            <Icon className="w-6 h-6" />
            <div>
              <div className="text-sm">{stat.label}</div>
              <div className="font-semibold">{stat.value}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsOverview;