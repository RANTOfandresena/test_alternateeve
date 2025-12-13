import type { DemandeCongeItem } from "../api/demandeConge";
import type { StatistiquesConge } from "../components/StatistiquesConge";

export const calculerStatistiques = (demandes: DemandeCongeItem[]): StatistiquesConge => {
  const acceptees = demandes.filter(d => d.statut === 'ACCEPTE').length;
  const refusees = demandes.filter(d => d.statut === 'REFUSE').length;
  const enAttente = demandes.filter(d => d.statut === 'EN_ATTENTE').length;
  
  // Calcul fictif des jours restants (25 jours - jours acceptés)
  const joursAcceptes = demandes
    .filter(d => d.statut === 'ACCEPTE')
    .reduce((total, d) => {
      const debut = new Date(d.dateDebut);
      const fin = new Date(d.dateFin);
      const jours = Math.ceil((fin.getTime() - debut.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return total + jours;
    }, 0);
  
  return {
    joursRestants: Math.max(0, 25 - joursAcceptes),
    demandesAcceptees: acceptees,
    demandesRefusees: refusees,
    demandesEnAttente: enAttente
  };
};