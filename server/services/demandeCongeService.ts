import { ObjectId, Types } from "mongoose";
import { DemandeCongeInput, StatutDemande, TypeConge } from "../models/DemandeConge";
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

export const recupererDemandes = (params: any) => {
  const { statut, employeId, dateDu, dateAu } = params;
  const filter: any = {};

  if (statut && Object.values(StatutDemande).includes(statut)) {
    filter.statut = statut;
  }

  if (employeId) {
    filter.employeId = employeId;
  }

  if (dateDu && dateAu) {
    const start = new Date(dateDu);
    const end = new Date(dateAu);

    filter.$or = [
      { dateDebut: { $gte: start, $lte: end } },
      { dateFin: { $gte: start, $lte: end } }
    ];
  }

  return DemandeRepository.trouverDemandes(filter);
};

export const accepterDemande = (id: string) => {
  return DemandeRepository.changerStatut(id, StatutDemande.ACCEPTE);
};

export const refuserDemande = (id: string) => {
  return DemandeRepository.changerStatut(id, StatutDemande.REFUSE);
};

export const  updateDemande = (id: string, employeId: string, data: Partial<DemandeCongeInput>)=> {
  const demande = DemandeRepository.findById(id, employeId);
  if (!demande) {
    throw new Error("Demande non trouvée ou vous n'avez pas la permission de la modifier.");
  }
  return DemandeRepository.update(id, employeId, data);
}

export const deleteDemandeCongeService = async (
  demandeId: string,
  employeId: string
) => {
  const demande = await DemandeRepository.findById(demandeId, employeId);
  if (!demande) {
    throw new Error(
      "Demande introuvable ou vous n’êtes pas autorisé à la supprimer."
    );
  }

  if (demande.dateDebut < new Date()) {
    throw new Error(
      "Impossible de supprimer une demande dont la période a déjà commencé."
    );
  }

  return DemandeRepository.deleteDemandeCongeById(demandeId);
};

function compterJoursOuvresSansDoublon( dateDebut: Date,dateFin: Date,employeId: Types.ObjectId): number {
  const demandeIclue = DemandeRepository.trouverDemandesInclusesEntreDeuxDates({employeId, dateDebut, dateFin})
  let total = 0;

  

  return total;
}