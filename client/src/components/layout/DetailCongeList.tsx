import type { DemandeCongeItem } from "../../api/demandeConge";

type DetailsCongeProps = {
  date: Date | null;
  conges: DemandeCongeItem[];
};

const DetailCongeList = ({ date, conges }: DetailsCongeProps) => {
  if (!date) {
    return (
      <div className="text-gray-400 italic">Sélectionnez une date</div>
    );
  }

  const statutStyles = {
    EN_ATTENTE: "bg-yellow-100 text-yellow-800 border border-gray-300",
    ACCEPTE: "bg-green-100 text-green-800 border border-gray-300",
    REFUSE: "bg-red-100 text-red-800 border border-gray-300",
  };

  return (
    <div>
      <h2 className="font-bold text-xl mb-4 text-gray-800">
        {date.toLocaleDateString()}
      </h2>

      {conges.length === 0 ? (
        <p className="text-gray-500">Aucun congé ce jour</p>
      ) : (
        <div className="space-y-3">
          {conges.map((c) => (
            <div
              key={c._id}
              className="border-1 border-gray-300 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
            >
              {/* Header: employé + statut */}
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-gray-700">{c.employeId}</span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${statutStyles[c.statut]}`}
                >
                  {c.statut.replace("_", " ")}
                </span>
              </div>

              {/* Tags pour type et dates */}
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                  Type: {c.type}
                </span>
                <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                  Du: {new Date(c.dateDebut).toLocaleDateString()}
                </span>
                <span className="px-2 py-1 text-sm rounded-full bg-gray-100 text-gray-800 border border-gray-300">
                  Au: {new Date(c.dateFin).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailCongeList;