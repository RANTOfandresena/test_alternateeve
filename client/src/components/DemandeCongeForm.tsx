import { useEffect, useRef, useState, type FormEvent } from "react";
import { useAppSelector } from "../hooks/hooks";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { getMesDemandesConge, type DemandeCongeItem, type DemandeCongePayload } from "../api/demandeConge";
import { formatLocalDate, isPresentOrFutureString } from "../utils/date";
import { normalize } from "./elements/CalendrierConge";

type LeaveType = DemandeCongePayload["type"];

interface LeaveRequestFormState {
  type: LeaveType;
  startDate: Date;
  endDate: Date;
  reason: string;
}

const initialState: LeaveRequestFormState = {
  type: "VACANCES",
  startDate: new Date(),
  endDate: new Date(),
  reason: "",
};

interface Props {
  isValidation?: boolean;
  demande?: DemandeCongeItem;
  onSubmit: (payload: DemandeCongeItem) => Promise<DemandeCongeItem>;
}

const DemandeCongeForm = ({ isValidation = false, demande, onSubmit }: Props) => {
  const { user } = useAppSelector((state) => state.auth);

  const isViewMode = isValidation && !!demande;
  const isEditMode = !isValidation && !!demande;
  const isCreateMode = !isValidation && !demande;
  const listParams = []

  const listParamsRef = useRef<Set<string>>(new Set());

  const [form, setForm] = useState(initialState);
  const [range, setRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [demandes,setDemande] = useState<DemandeCongeItem[]>([])

  /* ---------- dates ---------- */
  const demain = new Date();
  demain.setDate(demain.getDate() + 1);

  const isJourOuvre = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const estDateValide = (date: Date) =>
    date >= demain && isJourOuvre(date);
  useEffect(() => {
    if (!demande) return;

    setForm({
      type: demande.type,
      startDate: new Date(demande.dateDebut),
      endDate: new Date(demande.dateFin),
      reason: demande.commentaire || "",
    });

    setRange({
      from: new Date(demande.dateDebut),
      to: new Date(demande.dateFin),
    });
  }, [demande]);

  useEffect(() => {
    if (range?.from && range?.to) {
      setForm((prev) => ({
        ...prev,
        startDate: range.from!,
        endDate: range.to!,
      }));
    }
  }, [range]);

  useEffect(()=>{
    onMonthChange(range?.from ?? new Date())
  },[])

  const handleChange = <K extends keyof LeaveRequestFormState>(
    key: K,
    value: LeaveRequestFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };

  /* ---------- submit création / édition ---------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isViewMode) return;

    setLoading(true);
    try {
      const ok = await onSubmit({
        type: form.type,
        dateDebut: formatLocalDate(form.startDate),
        dateFin: formatLocalDate(form.endDate),
        commentaire: form.reason,
      });
      

      setSubmitted(ok !== null);
      if (isCreateMode) setForm(initialState);
    } catch {
      setError("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- validation manager ---------- */
  const handleValidation = async (statut: "ACCEPTE" | "REFUSE") => {
    setLoading(true);
    try {
      if(!demande) return
      await onSubmit({...demande,statut});
    } finally {
      setLoading(false);
    }
  };

  const onMonthChange = async (date: Date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);

    const params = `dateDu=${formatLocalDate(date)}&dateAu=${formatLocalDate(d)}`;

    if (!listParamsRef.current.has(params)) {
      const demandes = await getMesDemandesConge(params);
      setDemande(prev => [...prev, ...demandes]);

      listParamsRef.current.add(params);
    }
  };
  const joursReserves: Date[] = demandes.flatMap(demande => {
    const start = new Date(demande.dateDebut);
    const end = new Date(demande.dateFin);
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  });
  const modifiers = {
    deja_reserver: joursReserves,
    weekend:(date: Date) => date.getDay() === 0 || date.getDay() === 6
  };

  const modifiersClassNames = {
    deja_reserver: '!bg-yellow-200 !text-blue-800 !rounded-md',
    weekend: 'rdp-day rdp-disabled !bg-white !text-gray-400 !font-normal'
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-semibold mb-2">
        {isViewMode && "Validation de la demande"}
        {isEditMode && "Modifier la demande"}
        {isCreateMode && "Nouvelle demande"}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {/* TYPE */}
        <label className="flex flex-col gap-2 text-sm font-semibold">
          Type de congé
          <select
            disabled={isViewMode}
            value={form.type}
            onChange={(e) =>
              handleChange("type", e.target.value as LeaveType)
            }
            className="rounded-xl border border-slate-300 px-3 py-2 disabled:bg-slate-100"
          >
            <option value="VACANCES">Vacances</option>
            <option value="MALADIE">Maladie</option>
            {user?.user.genre === "FEMININ" ? (
              <option value="MATERNITE">Maternité</option>
            ) : (
              <option value="PATERNITE">Paternité</option>
            )}
            <option value="FAMILIAL">Familial</option>
          </select>
        </label>

        {/* DATE */}
        <DayPicker
          key={range?.from?.toISOString() ?? "today"}
          mode="range"
          selected={range}
          defaultMonth={range?.from}
          onSelect={isViewMode ? undefined : setRange}
          onMonthChange={onMonthChange}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          disabled={(date) => isViewMode || !estDateValide(date) || joursReserves.some(d => d.toDateString() === date.toDateString())}
        />

        {/* MOTIF */}
        <textarea
          disabled={isViewMode}
          required
          rows={4}
          value={form.reason}
          onChange={(e) => handleChange("reason", e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2 disabled:bg-slate-100"
          placeholder="Motif"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {submitted && !error && (
          <p className="text-green-600 text-sm">Enregistré avec succès</p>
        )}

        {/* ACTIONS */}
        {(demande === undefined || isPresentOrFutureString(demande.dateDebut)) && <div className="flex justify-end gap-3 mt-4">
          { demande && (demande.statut === "EN_ATTENTE" || demande.statut === "REFUSE") &&isViewMode && (
            <>
              {demande.statut !== "REFUSE" && <button
                type="button"
                onClick={() => handleValidation("REFUSE")}
                className="bg-red-500 text-white px-5 py-2 rounded-xl"
              >
                Refuser
              </button>}
              <button
                type="button"
                onClick={() => handleValidation("ACCEPTE")}
                className="bg-green-600 text-white px-5 py-2 rounded-xl"
              >
                Accepter
              </button>
            </>
          )}

          {!isViewMode && (
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl"
            >
              {isEditMode ? "Mettre à jour" : "Envoyer la demande"}
            </button>
          )}
        </div>}
      </form>
    </div>
  );
};

export default DemandeCongeForm;