import { Calendar, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';

export type StatistiquesConge = {
  joursRestants: number;
  demandesAcceptees: number;
  demandesRefusees: number;
  demandesEnAttente: number;
};

interface StatistiquesCongeProps {
  stats: StatistiquesConge;
}

const StatistiquesConge = ({ stats }: StatistiquesCongeProps) => {
  const statsCards = [
    {
      label: 'Jours restants',
      value: stats.joursRestants,
      icon: Calendar,
      color: 'bg-blue-100 text-blue-800',
      gradient: 'from-blue-500 to-blue-600',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Acceptées',
      value: stats.demandesAcceptees,
      icon: CheckCircle,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      label: 'En attente',
      color: 'bg-amber-100 text-amber-800',
      icon: Clock,
      color: 'bg-green-100 text-green-800',
      gradient: 'from-amber-500 to-amber-600',
      bgLight: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      label: 'Refusées',
      value: stats.demandesRefusees,
      icon: XCircle,
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      bgLight: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  return (
<div className="flex flex-wrap gap-3">
      {statsCards.map((stat) => {
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

export default StatistiquesConge;