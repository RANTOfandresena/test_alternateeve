import { CheckCircle, ClipboardList, Clock, XCircle } from "lucide-react";
import { useEffect, useState, type JSX } from "react";
import { getDashboardStats, type DashboardStats } from "../../api/demandeConge";
import PageLoader from "../../components/elements/PageLoader";

interface StatCard {
  title: string;
  value: number;
  icon: JSX.Element;
  color: string;
}

const StatsCards: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Erreur chargement stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return <PageLoader />;
  }

  const cards: StatCard[] = [
    {
      title: "Demandes en attente",
      value: stats.statsByStatut.pending,
      icon: <Clock size={24} />,
      color: "text-yellow-500", 
    },
    {
      title: "Demandes acceptées",
      value: stats.statsByStatut.accepted,
      icon: <CheckCircle size={24} />,
      color: "text-green-500",
    },
    {
      title: "Demandes refusées",
      value: stats.statsByStatut.refused,
      icon: <XCircle size={24} />,
      color: "text-red-500", 
    },
    {
      title: "Total des demandes",
      value: stats.statsByStatut.total,
      icon: <ClipboardList size={24} />,
      color: "text-blue-500", 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow p-5 flex items-center gap-4"
        >
          <div className={`p-3 rounded-full bg-gray-100 ${stat.color}`}>
            {stat.icon}
          </div>

          <div>
            <p className="text-sm text-gray-500">{stat.title}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;