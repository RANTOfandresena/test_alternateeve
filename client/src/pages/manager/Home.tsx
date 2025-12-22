import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import StatsCards from "./StatsCards";

const Home = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Tableau de bord
        </h1>
        <p className="text-gray-500 mt-1">
          Vue globale des demandes de congés
        </p>
      </div>

      {/* Stats */}
      <StatsCards />

      {/* Card action */}
      <div className="mt-10 bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Gestion des demandes
          </h2>
          <p className="text-sm text-gray-500">
            Accédez à toutes les demandes de congés et traitez-les rapidement.
          </p>
        </div>

        <Link
          to="/manager/demande"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg
                     bg-gradient-to-r from-blue-600 to-blue-500
                     text-white font-medium hover:opacity-90 transition"
        >
          Gérer les demandes
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Home;