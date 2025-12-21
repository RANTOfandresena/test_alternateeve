import { useEffect, useState } from "react";
import { DayButton, DayPicker, type DayButtonProps } from "react-day-picker";
import { fr } from "date-fns/locale";
import 'react-day-picker/dist/style.css';
import type { DemandeCongeItem } from "../../api/demandeConge";
import { getJoursFeriesByYear } from "../../api/jourFerie";
import Legend from "./Legend";

type CalendrierCongeProps = {
  conge: DemandeCongeItem[];
  dateSelected: (date: Date) => void;
};
export interface Conge {
  dateDebut: string | Date
  dateFin: string | Date
}

export const normalize = (d: Date): Date => new Date(d.getFullYear(), d.getMonth(), d.getDate())


const CalendrierConge = ({ conge, dateSelected}: CalendrierCongeProps) => {
  const [joursFerie, setJourFerie] = useState<Date[]>([]);
  const ranges = conge.map(d => ({
    name: d.statut,
    from: new Date(d.dateDebut),
    to: new Date(d.dateFin),
    user:
      typeof d.employeId === "string"
        ? d.employeId
        : d.employeId?._id ?? "Inconnu"
  }));
  useEffect(() => {
    const loadJoursFeries = async () => {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const dataCurrent = await getJoursFeriesByYear(currentYear.toString());
      const dataNext = await getJoursFeriesByYear(nextYear.toString());

      const allFeries = [...dataCurrent, ...dataNext].map(j => {
        const d = new Date(j.date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      });
      setJourFerie(allFeries);
    };

    loadJoursFeries();
  }, []);

  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const handleSelect = (day: Date) => {
    setSelectedDay(day);
    dateSelected(day)
  };

  const countUsersForDay = (date: Date) => {
    const usersSet = new Set<string>();
    const dayN = normalize(date)
    ranges.forEach(r => {
      const debut = normalize(new Date(r.from))
      const fin = normalize(new Date(r.to))
      if (dayN >= debut && dayN <= fin) usersSet.add(r.user);
    });
    return usersSet.size;
  };

  const modifiers = {
    EN_ATTENTE: ranges.filter(r => r.name === 'EN_ATTENTE').map(r => ({ from: r.from, to: r.to })),
    ACCEPTE: ranges.filter(r => r.name === 'ACCEPTE').map(r => ({ from: r.from, to: r.to })),
    REFUSE: ranges.filter(r => r.name === 'REFUSE').map(r => ({ from: r.from, to: r.to })),
    weekend: (date: Date) => date.getDay() === 0 || date.getDay() === 6,
    jourFerie: (date: Date) => joursFerie.some(d => d.getTime() === normalize(date).getTime()),
    disabled: (date: Date) => {
      const day = date.getDay();
      const isWeekend = day === 0 || day === 6;
      const isFerie = joursFerie.some(d => d.getTime() === normalize(date).getTime());
      return isWeekend || isFerie;
    },
  };

  const modifiersClassNames = {
    EN_ATTENTE: 'bg-yellow-100 text-blue-800 rounded-md',
    ACCEPTE: 'bg-green-200 text-green-800 rounded-md',
    REFUSE: 'bg-red-200 text-red-800 rounded-md',
    selected: 'border-2 border-blue-500 !rounded-full',
    weekend: '!bg-gray-100 !text-gray-400',
    jourFerie: '!bg-gray-100 !text-gray-400',
  };

  function DayButtonWithContext(props: DayButtonProps) {
    const { day, modifiers, ...buttonProps } = props;
    const userCount = countUsersForDay(day.date);

    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <DayButton {...buttonProps} day={day} modifiers={modifiers} className=" flex items-center justify-center" />
        {userCount > 1 && (
          <div
            className="absolute -top-1 -right-1"
            title={`${userCount} employés en congé`}
          >
            <span className="flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-blue-500 rounded-full">
              {userCount}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <DayPicker
        mode="single"
        locale={fr}
        selected={selectedDay}
        onSelect={handleSelect}
        modifiers={modifiers}
        modifiersClassNames={modifiersClassNames}
        numberOfMonths={3}
        components={{ DayButton: DayButtonWithContext }}
        required
      />
      <Legend/>
    </div>
  );
};

export default CalendrierConge;