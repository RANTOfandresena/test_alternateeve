import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { fr } from "date-fns/locale";
import { getDemandesCongeToViewMode, getMesDemandesConge, type DemandeCongeItem, type DemandeCongePayload } from "../api/demandeConge";
import { formatLocalDate, isPresentOrFutureString } from "../utils/date";
import Modal from "./elements/Modal";
import { getJoursFeriesByYear } from "../api/jourFerie";
import { normalize } from "./elements/CalendrierConge";
import Legend from "./elements/Legend";
import { CalendarDays, Clock } from "lucide-react";
import { getProfilUtilisateur } from "../api/utilisateur/utilisateur";
import { toast } from "react-toastify";

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
  onDeleteDemande? : () => Promise<boolean>
}

const DemandeCongeForm = ({ isValidation = false, demande, onSubmit, onDeleteDemande }: Props) => {
  
  const [joursFerie, setJourFerie] = useState<Date[]>([]);

  const isViewMode = isValidation && !!demande;
  const isEditMode = !isValidation && !!demande;
  const isCreateMode = !isValidation && !demande;

  const listParamsRef = useRef<Set<string>>(new Set());

  const [form, setForm] = useState(initialState);
  const [range, setRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [demandes,setDemande] = useState<DemandeCongeItem[]>([])
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [nbJour,setNbJour] = useState<number>(0)
  const [solde, setSolde] = useState<number>(0)


  const isJourOuvre = (date: Date) => {
    const day = date.getDay();
    return day !== 0 && day !== 6;
  };

  const estDateValide = (date: Date) => date >= new Date() && isJourOuvre(date);
  const fetchProfil = async () => {
    try {
      const data = await getProfilUtilisateur();
      setSolde(data.nbJour);
    } catch (e: any) {
      console.error(e);
      toast.error(
        e?.response?.data?.message ||
          "Erreur lors du chargement"
      );
    } finally {
      setLoading(false);
    }
  };

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
    setNbJour(demande.nbJour!)
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
    fetchProfil()
  },[])

  const handleChange = <K extends keyof LeaveRequestFormState>(
    key: K,
    value: LeaveRequestFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError(null);
  };
  useEffect(() => {
    const loadJoursFeries = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;

        const dataCurrent = await getJoursFeriesByYear(currentYear.toString());
        const dataNext = await getJoursFeriesByYear(nextYear.toString());

        const allFeries = [...dataCurrent, ...dataNext].map(j => {
          const d = new Date(j.date);
          return new Date(d.getFullYear(), d.getMonth(), d.getDate());
        });

        setJourFerie(allFeries);
      } catch (err: any) {
        console.error(err);
        toast.error(
          err?.response?.data?.message || "Erreur lors du chargement des jours fériés"
        );
      }
    };

    loadJoursFeries();
  }, []);

  useEffect(() => {
    if (!range?.from || !range?.to) {
      setNbJour(0);
      console.log("-hayhayah")
      return;
    }

    const count = calculerJoursOuvrables(range?.from, range?.to)

    setNbJour(count);
  }, [range, joursFerie]);
  const calculerJoursOuvrables = (dateDebut: Date, dateFin: Date): number => {
    let count = 0;
    let current = normalize(new Date(dateDebut));

    const end = normalize(new Date(dateFin));

    while (current <= end) {
      const day = current.getDay();
      const isWeekend = day === 0 || day === 6;
      const isFerie = joursFerie.some(
        (f) => formatLocalDate(f) === formatLocalDate(current)
      );

      if (!isWeekend && !isFerie) {
        count++;
      }

      current.setDate(current.getDate() + 1);
    }

    return count;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isViewMode) return;
    if(isEditMode && demande.statut === "ACCEPTE"){
      const valide = confirm("Si vous modifiez votre demande ,le Manager va re-examiné votre demande de congé");
      if(!valide) return
    }

    setLoading(true);
    try {
      let data: DemandeCongeItem = {
        type: form.type,
        dateDebut: formatLocalDate(form.startDate),
        dateFin: formatLocalDate(form.endDate),
        commentaire: form.reason,
      }
      if(isEditMode)
        data = {_id : demande._id, ...data}

      const ok = await onSubmit(data);
      

      setSubmitted(ok !== null);
      if (isCreateMode) setForm(initialState);
    } catch(e) {
      console.log(e)
      // setError("Erreur lors de l'enregistrement");
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = async (statut: "ACCEPTE" | "REFUSE") => {
    setLoading(true);
    try {
      if(!demande) return
      await onSubmit({...demande,statut});
    } finally {
      setLoading(false);
    }
  };

  const onMonthChange = useCallback(async (date: Date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1);

    const params = `dateDu=${formatLocalDate(date)}&dateAu=${formatLocalDate(d)}&excludeRefuse=true`;

    if (!listParamsRef.current.has(params)) {
      let demandesReponse = isViewMode ? await getDemandesCongeToViewMode(params) : await getMesDemandesConge(params);
      demandesReponse = demandesReponse.filter((dem) => dem.dateDebut !== demande?.dateDebut && dem.dateFin !== demande?.dateFin)
      setDemande(prev => [...prev, ...demandesReponse]);

      listParamsRef.current.add(params);
    }
  }, [demande?.dateDebut, demande?.dateFin]);
  const joursReserves: Date[] = demandes.flatMap(demande => {
    const start = new Date(demande.dateDebut);
    const end = new Date(demande.dateFin);
    const dates = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  });
  const handleAnnulerDemande = async () => {
    if (!onDeleteDemande) return;
    const success = await onDeleteDemande();
    setOpenModal(false)
    if (!success) {
      setError("Une erreur est survenue lors de l’annulation de la demande");
    }
  };

  const modifiers = {
    deja_reserver: joursReserves,
    weekend:(date: Date) => date.getDay() === 0 || date.getDay() === 6,
    jourFerie: (date: Date) => joursFerie.some(d => d.getTime() === normalize(date).getTime()),
  };

  const handleRangeSelect = (newRange: DateRange | undefined) => {
    if (!newRange?.from || !newRange?.to) return;
    if (isViewMode) return;

    if (!isRangeValid(newRange)) {
      alert("Votre sélection contient des jours déjà réservés. Choisissez un autre range.");
      return;
    }

    if (!hasSoldeSuffisant(newRange)) {
      alert("Votre solde de congé est insuffisant.");
      return;
    }

    setRange(newRange);
  };
  const hasSoldeSuffisant = (rangeP: DateRange): boolean => {
    if(!rangeP.from || !rangeP.to) {
      
      return false
    }
    const soldeDisponible =
      demande?.employeId?.soldeConge !== undefined && demande?.nbJour !== undefined
        ? demande.employeId.soldeConge + demande.nbJour + 1
        : solde;

    const nbJours = calculerJoursOuvrables(rangeP.from, rangeP.to);

    return nbJours <= soldeDisponible;
  };

  const isDateDisabled = (date: Date) => {
    if (isViewMode) return true;

    if (demande && !isPresentOrFutureString(demande.dateDebut)) return true;

    if (!estDateValide(date)) return true;

    if (joursReserves.some(d => formatLocalDate(d) === formatLocalDate(date))) return true;

    if (joursFerie.some(d => formatLocalDate(d) === formatLocalDate(date))) return true;

    return false;
  };

  const modifiersClassNames = {
    deja_reserver: 'bg-yellow-200 text-blue-800 rounded-md',
    weekend: '!bg-gray-100 !text-gray-400',
    jourFerie: '!bg-gray-100 !text-gray-400',
  };
  const isRangeValid = (range: DateRange | undefined) => {
    if (!range?.from || !range.to) return true;

    const start = range.from;
    const end = range.to;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (joursReserves.some(r => formatLocalDate(r) === formatLocalDate(d))) {
        return false;
      }
    }
    return true;
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8">
      <Modal
        open={openModal}
        onClose={()=>setOpenModal(false)}
        title="Confirmation"
      >
        <p>Vous voulez vraiment retirer cette demande de congé ?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 cursor-pointer"
            onClick={() => setOpenModal(false)}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
            onClick={handleAnnulerDemande}
          >
            Retirer
          </button>
        </div>
      </Modal>
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
            disabled={isViewMode || (demande && !isPresentOrFutureString(demande.dateDebut))}
            value={form.type}
            onChange={(e) =>
              handleChange("type", e.target.value as LeaveType)
            }
            className="rounded-xl border border-slate-300 px-3 py-2 disabled:bg-slate-100"
          >
            <option value="VACANCES">Vacances</option>
            <option value="MALADIE">Maladie</option>
            <option value="ABSENCE">Abcence</option>
          </select>
        </label>

        {/* DATE */}
        <div>
          <div className="flex gap-6">
            {/* Calendrier à gauche */}
            <div className="flex-1">
              <DayPicker
                locale={fr}
                key={range?.from?.toISOString() ?? "today"}
                mode="range"
                selected={range}
                defaultMonth={range?.from}
                onSelect={handleRangeSelect}
                onMonthChange={onMonthChange}
                modifiers={modifiers}
                modifiersClassNames={modifiersClassNames}
                disabled={isDateDisabled}
                required
              />
            </div>

            {/* Colonne de stats à droite */}
            <div className="flex flex-col justify-center gap-6">
              {/* Jours sélectionnés */}
              <div className="flex items-center gap-3 p-4 rounded-2xl shadow-md bg-white">
                <CalendarDays className="w-8 h-8 text-indigo-500" />
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xs text-gray-500 text-center">Nombre de jours</div>
                  <div className="text-xl font-bold text-gray-800 text-center">{nbJour}</div>
                </div>
              </div>

              {/* Jours restants */}
              <div className="flex items-center gap-3 p-4 rounded-2xl shadow-md bg-white">
                <Clock className="w-6 h-6 text-gray-400" />
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xs text-gray-500 text-center">Solde congé restant</div>
                  
                  <div className="text-xl font-bold text-gray-800 text-center">
                  {demande?.employeId?.soldeConge !== undefined && demande?.nbJour !== undefined
                    ? demande.employeId.soldeConge + demande.nbJour - nbJour
                    : solde - nbJour}
                </div>
                </div>
              </div>
            </div>
          </div>

          <Legend showCount={false} />
        </div>

        <textarea
          disabled={isViewMode || (demande && !isPresentOrFutureString(demande.dateDebut))}
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
        
        {(demande === undefined || isPresentOrFutureString(demande.dateDebut)) && 
          <>
            { demande && (demande.statut === "EN_ATTENTE" || demande.statut === "REFUSE") && isViewMode && (
              <div className="flex justify-end gap-3 mt-4">
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
              </div>
            )}

            {!isViewMode && (
              <div className="flex justify-between items-center">
                {demande && isPresentOrFutureString(demande.dateDebut) ? (
                  <div
                    onClick={() => setOpenModal(true)}
                    className="bg-red-400 text-white px-6 py-3 rounded-xl cursor-pointer"
                  >
                    Retirer la demande
                  </div>
                ) : (
                  <div />
                )}

                {range && hasSoldeSuffisant(range) && (<button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl cursor-pointer"
                >
                  {isEditMode ? "Mettre à jour" : "Envoyer la demande"}
                </button>)}
              </div>
            )}
          </>
        }
      </form>
    </div>
  );
};

export default DemandeCongeForm;