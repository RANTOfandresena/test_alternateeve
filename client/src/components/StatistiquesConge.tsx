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
      color: 'blue',
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
      value: stats.demandesEnAttente,
      icon: Clock,
      color: 'amber',
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
    <div className="w-full max-w-5xl">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-slate-600" />
        <h2 className="text-xl font-bold text-slate-900">Statistiques de congés</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              <div className="relative p-6">
                <div className={`${card.bgLight} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-slate-600">{card.label}</p>
                  <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
                </div>
              </div>
              <div className={`h-1 bg-gradient-to-r ${card.gradient}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatistiquesConge;