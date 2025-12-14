
/**
 * Format une date au format  (jj/mm/aaaa)
 */

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('fr-FR', { year: 'numeric', month: 'short', day: '2-digit' }).format(
    new Date(value)
);


/**
 * Format une date avec le jour de la semaine
 */
export const formatDateWithDay = (dateString: string | Date): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

/**
 * Vérifie si une période (dateDebut - dateFin) se trouve dans une plage donnée (rangeStart - rangeEnd)
 */
export const isDateInRange = (
  periodStart: string | Date,
  periodEnd: string | Date,
  rangeStart: string | Date,
  rangeEnd: string | Date
): boolean => {
  // Si les dates de plage ne sont pas définies, on considère qu'il n'y a pas de filtre
  if (!rangeStart || !rangeEnd) return true;

  const start = new Date(periodStart);
  const end = new Date(periodEnd);
  const filterStart = new Date(rangeStart);
  const filterEnd = new Date(rangeEnd);

  // Normaliser les dates (enlever l'heure pour comparer seulement les dates)
  const normalizeDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const normalizedStart = normalizeDate(start);
  const normalizedEnd = normalizeDate(end);
  const normalizedFilterStart = normalizeDate(filterStart);
  const normalizedFilterEnd = normalizeDate(filterEnd);

  // Vérifie si la période chevauche la plage de filtres
  // C'est le cas si :
  // 1. La période commence avant la fin du filtre ET se termine après le début du filtre
  // OU
  // 2. La période est complètement incluse dans le filtre
  // OU
  // 3. La période commence dans le filtre
  // OU
  // 4. La période se termine dans le filtre

  return (
    (normalizedStart <= normalizedFilterEnd && normalizedEnd >= normalizedFilterStart) ||
    (normalizedStart >= normalizedFilterStart && normalizedEnd <= normalizedFilterEnd) ||
    (normalizedStart >= normalizedFilterStart && normalizedStart <= normalizedFilterEnd) ||
    (normalizedEnd >= normalizedFilterStart && normalizedEnd <= normalizedFilterEnd)
  );
};

/**
 * Vérifie si une date se trouve dans une plage (inclusive)
 */
export const isSingleDateInRange = (
  date: string | Date,
  rangeStart: string | Date,
  rangeEnd: string | Date
): boolean => {
  if (!rangeStart || !rangeEnd) return true;

  const targetDate = new Date(date);
  const filterStart = new Date(rangeStart);
  const filterEnd = new Date(rangeEnd);

  // Normaliser les dates
  const normalizeDate = (date: Date) => {
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    return normalized;
  };

  const normalizedTarget = normalizeDate(targetDate);
  const normalizedFilterStart = normalizeDate(filterStart);
  const normalizedFilterEnd = normalizeDate(filterEnd);

  return normalizedTarget >= normalizedFilterStart && normalizedTarget <= normalizedFilterEnd;
};

/**
 * Calcule la durée en jours entre deux dates
 */
export const calculateDuration = (startDate: string | Date, endDate: string | Date): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Normaliser les dates pour ne compter que les jours complets
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 pour inclure le jour de début
  
  return diffDays;
};

/**
 * Format une durée en jours avec le texte approprié
 */
export const formatDuration = (startDate: string | Date, endDate: string | Date): string => {
  const days = calculateDuration(startDate, endDate);
  return `${days} jour${days > 1 ? 's' : ''}`;
};

/**
 * Vérifie si une date est dans le passé
 */
export const isPastDate = (date: string | Date): boolean => {
  const targetDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return targetDate < today;
};

/**
 * Vérifie si une date est aujourd'hui
 */
export const isToday = (date: string | Date): boolean => {
  const targetDate = new Date(date);
  const today = new Date();
  
  return (
    targetDate.getDate() === today.getDate() &&
    targetDate.getMonth() === today.getMonth() &&
    targetDate.getFullYear() === today.getFullYear()
  );
};

/**
 * Vérifie si une date est dans le futur
 */
export const isFutureDate = (date: string | Date): boolean => {
  const targetDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return targetDate > today;
};

/**
 * Vérifie si une période chevauche aujourd'hui
 */
export const isPeriodOverlappingToday = (
  startDate: string | Date,
  endDate: string | Date
): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  
  return start <= today && end >= today;
};

/**
 * Convertit une date en chaîne au format YYYY-MM-DD pour les inputs date
 */
export const toDateInputValue = (date: string | Date): string => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Obtient la date du jour au format français
 */
export const getFrenchDateString = (date?: Date): string => {
  const targetDate = date || new Date();
  return targetDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Génère un tableau de dates entre deux dates
 */
export const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

/**
 * Vérifie si deux périodes se chevauchent
 */
export const doPeriodsOverlap = (
  period1Start: Date,
  period1End: Date,
  period2Start: Date,
  period2End: Date
): boolean => {
  return (
    period1Start <= period2End && period1End >= period2Start
  );
};

export function compterJoursOuvres(dateDebut: Date, dateFin: Date): number {
  if (dateDebut > dateFin) return 0;

  let count = 0;
  const current = new Date(dateDebut);

  while (current <= dateFin) {
    const jour = current.getDay(); // 0 = dimanche, 6 = samedi
    if (jour !== 0 && jour !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
}