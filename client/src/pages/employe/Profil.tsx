import { useAppSelector } from "../../hooks/hooks";
import PageLoader from "../../components/elements/PageLoader";
import { useState, useEffect } from "react";
import { getProfilUtilisateur, type ProfilUtilisateur } from "../../api/utilisateur/utilisateur";
import { User, Mail, Calendar, TrendingUp, Clock, FileText } from "lucide-react";

const Profil = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [profil, setProfil] = useState<ProfilUtilisateur | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getProfilUtilisateur()
        .then((data) => setProfil(data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user || loading || !profil) {
    return <PageLoader />;
  }

  const getStatusColor = (statut: string) => {
    const colors: Record<string, string> = {
      'ACCEPTE': 'bg-green-100 text-green-700 border-green-200',
      'EN_ATTENTE': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'REFUSE': 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[statut] || 'bg-blue-100 text-blue-700 border-blue-200';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      'VACANCES': '🏖️',
      'MALADIE': '🏥',
    };
    return icons[type] || '📄';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 min-h-0">

      {/* En-tête du profil */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.user.nom)}&background=4F46E5&color=fff&size=256`}
                alt={`${user.user.nom} avatar`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-left sm:mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{user.user.nom}</h1>
              <p className="text-lg text-indigo-600 capitalize font-medium mt-1">{user.user.role}</p>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.user.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total demandes</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{profil.totalDemandes}</p>
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
              <p className="text-3xl font-bold text-gray-900 mt-2">{profil.totalJours}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Moyenne / demande</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {profil.totalDemandes > 0 ? (profil.totalJours / profil.totalDemandes).toFixed(1) : '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Par statut */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            Statistiques par statut
          </h3>
          <div className="space-y-3">
            {Object.entries(profil.statsParStatut).map(([statut, count]) => (
              <div key={statut} className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(statut)}`}>
                  {statut}
                </span>
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Par type */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Statistiques par type
          </h3>
          <div className="space-y-3">
            {Object.entries(profil.statsParType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-700 font-medium">
                  <span className="text-xl">{getTypeIcon(type)}</span>
                  {type}
                </span>
                <span className="text-2xl font-bold text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dernières demandes */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Dernières demandes
        </h3>
        <div className="space-y-3">
          {profil.dernieresDemandes.length > 0 ? (
            profil.dernieresDemandes.map((d) => (
              <div key={d._id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">{getTypeIcon(d.type!)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">{d.type}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(d.dateDebut).toLocaleDateString('fr-FR')} - {new Date(d.dateFin).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                      {d.nbJour} {d.nbJour! > 1 ? 'jours' : 'jour'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(d.statut!)}`}>
                      {d.statut}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">Aucune demande récente</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Profil;