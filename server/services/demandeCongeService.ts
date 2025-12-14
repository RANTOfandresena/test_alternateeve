import { Types } from "mongoose";
import { StatutDemande, TypeConge } from "../models/DemandeConge";
import * as DemandeRepository from "../repository/demandeCongeRepository";

export const creerDemande = async (data: {
  employeId: Types.ObjectId;
  type: TypeConge;
  dateDebut: Date;
  dateFin: Date;
  commentaire?: string;
}) => {
  if (!data.type || !data.dateDebut || !data.dateFin) {
    throw new Error("Champs requis manquants");
  }

  return DemandeRepository.creerDemande({
    ...data,
    statut: StatutDemande.EN_ATTENTE
  });
};

export const recupererMesDemandes = (employeId: string) => {
  return DemandeRepository.trouverParEmploye(employeId);
};

export const recupererDemandes = (params: any) => {
  const { statut, employeId } = params;
  const filter: any = {};

  if (statut && Object.values(StatutDemande).includes(statut)) {
    filter.statut = statut;
  }

  if (employeId) {
    filter.employeId = employeId;
  }

  return DemandeRepository.trouverDemandes(filter);
};

export const accepterDemande = (id: string) => {
  return DemandeRepository.changerStatut(id, StatutDemande.ACCEPTE);
};

export const refuserDemande = (id: string) => {
  return DemandeRepository.changerStatut(id, StatutDemande.REFUSE);
};