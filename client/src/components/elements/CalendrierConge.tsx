import React, { useState } from "react";
import { CalendarDay, DayButton, DayPicker, type DayButtonProps } from "react-day-picker";
import { fr } from "date-fns/locale";
import 'react-day-picker/dist/style.css';
import type { DemandeCongeItem } from "../../api/demandeConge";

type CalendrierCongeProps = {
  conge: DemandeCongeItem[];
};

const CalendrierConge = ({ conge }: CalendrierCongeProps) => {
  const ranges = conge.map(d => ({
    name: d.statut,
    from: new Date(d.dateDebut),
    to: new Date(d.dateFin),
    user: d.employeId || "Inconnu"
  }));

  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [coveringRanges, setCoveringRanges] = useState<string[]>([]);

  const handleSelect = (day: Date) => {
    setSelectedDay(day);
    const matched = ranges
      .filter(r => day >= r.from && day <= r.to)
      .map(r => r.name);
    setCoveringRanges(matched);
  };

  const countUsersForDay = (date: Date) => {
    const usersSet = new Set<string>();
    ranges.forEach(r => {
      if (date >= r.from && date <= r.to) usersSet.add(r.user);
    });
    return usersSet.size;
  };

  const modifiers = {
    ...ranges.reduce((acc, r) => {
      acc[r.name] = { from: r.from, to: r.to };
      return acc;
    }, {} as Record<string, { from: Date; to: Date }>),

    weekend: (date: Date) => date.getDay() === 0 || date.getDay() === 6
  };

  const modifiersClassNames = {
    EN_ATTENTE: 'bg-yellow-100 text-blue-800 rounded-md',
    ACCEPTE: 'bg-green-200 text-green-800 rounded-md',
    REFUSE: 'bg-red-200 text-red-800 rounded-md',
    selected: 'border-2 border-blue-500 !rounded-full',
    weekend: '!bg-gray-100 !text-gray-400'
  };

  function DayButtonWithContext(props: DayButtonProps) {
    const { day, modifiers, ...buttonProps } = props;
    const userCount = countUsersForDay(day.date);

    return (
      <div className="relative w-10 h-10 flex items-center justify-center">
        <DayButton {...buttonProps} day={day} modifiers={modifiers} className="z-1 flex items-center justify-center" />
        {userCount > 1 && (
          <div className="absolute -top-1 -right-1 z-2">
            <span className="flex items-center justify-center w-3 h-3 text-xs font-bold text-white bg-blue-500 rounded-full">
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
        numberOfMonths={12}
        components={{ DayButton: DayButtonWithContext }}
        required
      />

      <div className="mt-4">
        {selectedDay && (
          <div>
            Jour sélectionné: {selectedDay.toLocaleDateString()} <br />
            Plages couvrantes: {coveringRanges.join(', ') || "Aucune"}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendrierConge;