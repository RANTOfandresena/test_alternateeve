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

export const recupererDemandes = async (params: any) => {
  const { statut, employeId, dateDu, dateAu, type, search, excludeRefuse } = params;
  const filter: any = {};

  if (statut && Object.values(StatutDemande).includes(statut)) {
    filter.statut = statut;
  } else if (excludeRefuse) {
    filter.statut = { $ne: StatutDemande.REFUSE };
  }

  if (employeId) {
    filter.employeId = employeId;
  }
  if(type){
    filter.type = type
  }

  if (dateDu && dateAu) {
    const start = new Date(dateDu);
    const end = new Date(dateAu);

    filter.$or = [
      { dateDebut: { $lte: end, $gte: start } },
      { dateFin: { $lte: end, $gte: start } },
      { dateDebut: { $lte: start }, dateFin: { $gte: end } }
    ];
  }

  return DemandeRepository.trouverDemandes(filter, search);
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


export async function getProfilUtilisateurResume(user) {
  const demandes = await DemandeRepository.getDemandesByUserId(user._id);

  const totalDemandes = demandes.length;
  const totalJours = demandes.reduce((acc, d) => acc + (d.nbJour || 0), 0);

  const statsParStatut: Record<string, number> = {};
  Object.values(StatutDemande).forEach(statut => {
    statsParStatut[statut] = demandes.filter(d => d.statut === statut).length;
  });

  const statsParType: Record<string, number> = {};
  Object.values(TypeConge).forEach(type => {
    statsParType[type] = demandes.filter(d => d.type === type).length;
  });

  const dernieresDemandes = demandes.slice(0, 3).map(d => ({
    id: d._id,
    type: d.type,
    dateDebut: d.dateDebut,
    dateFin: d.dateFin,
    nbJour: d.nbJour,
    statut: d.statut,
    commentaire: d.commentaire
  }));

  return {
    id: user._id,
    nom: user.nom,
    email: user.email,
    genre: user.genre,
    role: user.role,
    isActive: user.isActive,
    totalDemandes,
    totalJours,
    statsParStatut,
    statsParType,
    dernieresDemandes
  };
}