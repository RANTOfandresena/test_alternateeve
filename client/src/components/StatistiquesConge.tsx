import { Calendar, CheckCircle, TrendingUp, FileText, AlertCircle, CalendarCheck } from 'lucide-react';
import type { ProfilUtilisateur } from '../api/utilisateur/utilisateur';


interface StatistiquesCongeProps {
  stats: ProfilUtilisateur;
}

const StatistiquesConge = ({ stats }: StatistiquesCongeProps) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total demandes</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalDemandes}</p>
          </div>
          <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total jours</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalJours}</p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Solde Congé restant
            </p>

            <p
              className={`text-3xl font-bold mt-2 ${
                stats.nbJour > 10
                  ? 'text-green-600'
                  : stats.nbJour > 5
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {stats.nbJour}
            </p>
          </div>

          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              stats.nbJour > 10
                ? 'bg-green-100'
                : stats.nbJour > 5
                ? 'bg-yellow-100'
                : 'bg-red-100'
            }`}
          >
            <CalendarCheck
              className={`w-6 h-6 ${
                stats.nbJour > 10
                  ? 'text-green-600'
                  : stats.nbJour > 5
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatistiquesConge;

