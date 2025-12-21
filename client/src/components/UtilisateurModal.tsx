import { useEffect, useState } from "react";
import { X, Save, ShieldCheck, UserCheck } from "lucide-react";
import type { UtilisateurDto } from "../utils/type";

type Props = {
  open: boolean;
  utilisateur: UtilisateurDto | null;
  onClose: () => void;
  onSave: (data: {
    role: UtilisateurDto["role"];
    isActive: boolean;
    soldeConge: number;
  }) => void;
};

export default function UtilisateurModal({
  open,
  utilisateur,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState({
    role: "EMPLOYE" as UtilisateurDto["role"],
    isActive: true,
    soldeConge: 0,
  });

  useEffect(() => {
    if (utilisateur) {
      setForm({
        role: utilisateur.role,
        isActive: utilisateur.isActive,
        soldeConge: utilisateur.soldeConge,
      });
    }
  }, [utilisateur]);

  if (!open || !utilisateur) return null;

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">{utilisateur.nom}</h2>
            <p className="text-sm text-gray-500">{utilisateur.email}</p>
          </div>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        {/* ROLE */}
        <div>
          <label className="text-sm font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Rôle
          </label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as any })
            }
            className="mt-1 w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="EMPLOYE">Employé</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>

        {/* STATUT */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Compte actif
          </span>
<label className="inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    checked={form.isActive}
    onChange={(e) =>
      setForm({ ...form, isActive: e.target.checked })
    }
    className="sr-only peer"
  />

  <div
    className="relative w-11 h-6 rounded-full bg-gray-300 transition-colors peer-checked:bg-green-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-5 "
  />
</label>
        </div>

        {/* SOLDE */}
        <div>
          <label className="text-sm font-medium">Solde de congé (jours)</label>
          <input
            type="number"
            min={0}
            value={form.soldeConge}
            onChange={(e) =>
              setForm({ ...form, soldeConge: Number(e.target.value) })
            }
            className="mt-1 w-full border rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl border"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700"
          >
            <Save className="w-4 h-4" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}