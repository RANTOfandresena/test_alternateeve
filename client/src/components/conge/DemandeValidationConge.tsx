import { useEffect, useState } from "react";
import { X, Save, AlertTriangle } from "lucide-react";
import { Select, Textarea, Input } from "../elements/elements";
import type { DemandeCongeItem } from "../../api/demandeConge";

export type TypeConge =  'VACANCES' | 'MALADIE' | 'ABSENCE';

export type StatutDemande =
  | "EN_ATTENTE"
  | "ACCEPTE"
  | "REFUSE";

/* ===================== Props ===================== */
type Props = {
  demande: DemandeCongeItem;
  onSave: (payload: DemandeCongeItem) => Promise<void>;
};

/* ===================== Composant Principal ===================== */
export default function DemandeValidationConge({
  demande,
  onSave,
}: Props) {
  /* ---------- État ---------- */
  const [form, setForm] = useState<DemandeCongeItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* ---------- Initialisation du formulaire ---------- */
  useEffect(() => {

    setForm({
      ...demande,
      dateDebut: demande.dateDebut,
      dateFin: demande.dateFin,
    });
    setErreur(null);
    setSuccess(null);
  }, [demande]);

  if (!form) return null;

  /* ---------- Utilitaires ---------- */
  const formatDateInput = (value: Date | string): string => {
    const date = value instanceof Date ? value : new Date(value);
    return Number.isNaN(date.getTime())
      ? ""
      : date.toISOString().slice(0, 10);
  };

  const handleChange = <K extends keyof DemandeCongeItem>(
    field: K,
    value: DemandeCongeItem[K]
  ) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const valider = (): string | null => {
    const debut = new Date(form.dateDebut);
    const fin = new Date(form.dateFin);

    if (Number.isNaN(debut.getTime()) || Number.isNaN(fin.getTime())) {
      return "Dates invalides";
    }

    if (debut > fin) {
      return "La date de début doit être antérieure ou égale à la date de fin.";
    }

    if (!form.type) return "Choisissez un type de congé.";
    if (!form.statut) return "Choisissez un statut.";

    return null;
  };

  /* ---------- Gestionnaires d'actions ---------- */
  const handleSave = async () => {
    setErreur(null);

    const erreurValidation = valider();
    if (erreurValidation) {
      setErreur(erreurValidation);
      return;
    }

    setSaving(true);

    try {
      const payload: DemandeCongeItem = {
        ...form,
        dateDebut: form.dateDebut,
        dateFin: form.dateFin,
      };

      await onSave(payload);

      setSuccess("Enregistré avec succès.");

      setTimeout(() => {
        setSaving(false);
        setSuccess(null);
      }, 600);
    } catch (e: any) {
      setErreur(e?.message || "Erreur lors de l'enregistrement.");
      setSaving(false);
    }
  };
  /* ===================== Rendu ===================== */

  return (
    <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
            label="Employé"
            value={String(form.employeId)}
            readOnly
        />

        <Select
            label="Type de congé"
            value={form.type}
            onChange={(e:any) =>
            handleChange("type", e.target.value as TypeConge)
            }
            options={{
            ANNUEL: "Annuel",
            MALADIE: "Maladie",
            CONGEPARENTALE: "Congé parental",
            SANS_SOLDE: "Sans solde",
            }}
        />

        <Input
            label="Date début"
            type="date"
            value={formatDateInput(form.dateDebut)}
            onChange={(e:any) => handleChange("dateDebut", e.target.value)}
        />

        <Input
            label="Date fin"
            type="date"
            value={formatDateInput(form.dateFin)}
            onChange={(e:any) => handleChange("dateFin", e.target.value)}
        />
        </div>

        <Textarea
        label="Commentaire"
        value={form.commentaire ?? ""}
        onChange={(e:any) => handleChange("commentaire", e.target.value)}
        />

        <Select
        label="Statut"
        value={form.statut}
        onChange={(e:any) =>
            handleChange("statut", e.target.value as StatutDemande)
        }
        options={{
            EN_ATTENTE: "En attente",
            APPROUVE: "Approuvé",
            REFUSE: "Refusé",
        }}
        />

        {/* Messages d'erreur/succès */}
        {erreur && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 p-3 rounded-md">
            <AlertTriangle className="w-4 h-4" />
            {erreur}
        </div>
        )}

        {success && (
        <div className="text-sm text-green-700 bg-green-50 p-3 rounded-md">
            {success}
        </div>
        )}

        {/* Boutons d'action */}
        <div className="flex justify-end gap-3">
        <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white text-sm"
        >
            <Save className="w-4 h-4" />
            Enregistrer
        </button>
        </div>
    </div>
  );
}