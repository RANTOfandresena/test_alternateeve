import { ObjectId, Types } from "mongoose";
import DemandeConge, { DemandeCongeInput, StatutDemande, TypeConge } from "../models/DemandeConge";
import * as DemandeRepository from "../repository/demandeCongeRepository";
import * as UtilisateurRepository from  "../repository/utilisateurRepository"
import { IUtilisateur } from "../models/Utilisateur";
import { EmployePeuple } from "../repository/demandeCongeRepository";

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
  const demande =await DemandeRepository.creerDemande({
    ...data,
    statut: StatutDemande.EN_ATTENTE
  });
  await UtilisateurRepository.mettreAJourSoldeConge(demande.employeId._id, -demande.nbJour);
  return demande;
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
    filter.employeId = typeof employeId === "string" ? new Types.ObjectId(employeId) : new Types.ObjectId(employeId._id);
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

export const accepterDemande = async (id: string) => {
  const demande = await DemandeRepository.trouverParId(id);

  if (!demande) {
    throw new Error("Demande non trouvée ou vous n'avez pas la permission de la modifier.");
  }

  // if (demande.statut !== StatutDemande.EN_ATTENTE) {
  //   throw new Error("Cette demande a déjà été traitée.");
  // }

  if (demande.dateDebut < new Date()) {
    throw new Error(
      "Impossible de mettre à jour une demande dont la période a déjà commencé."
    );
  }

  return await DemandeRepository.changerStatut(id, StatutDemande.ACCEPTE);
};

export const refuserDemande = async (id: string) => {
  const demande = await DemandeRepository.trouverParId(id);
  if (!demande) {
    throw new Error("Demande non trouvée ou vous n'avez pas la permission de la modifier.");
  }
  if (demande.dateDebut < new Date()) {
    throw new Error(
      "Impossible de mettre une demande a jour dont la période a déjà commencé."
    );
  }

  await UtilisateurRepository.mettreAJourSoldeConge(demande.employeId._id, +demande.nbJour);

  return DemandeRepository.changerStatut(id, StatutDemande.REFUSE);
};

export const  updateDemande = async (id: string, employeId: string, data: Partial<DemandeCongeInput>)=> {
  const demande = await DemandeRepository.findById(id, employeId);
  if (!demande) {
    throw new Error("Demande non trouvée ou vous n'avez pas la permission de la modifier.");
  }
  if (demande.dateDebut < new Date()) {
    throw new Error(
      "Impossible de mettre une demande a jour dont la période a déjà commencé."
    );
  }

  await UtilisateurRepository.mettreAJourSoldeConge(demande.employeId._id, +demande.nbJour);
  
  const nvlDemande =await DemandeRepository.update(id, employeId, data);

  const soldeConge = await UtilisateurRepository.mettreAJourSoldeConge(demande.employeId._id, -nvlDemande.nbJour);
  if (nvlDemande.employeId && typeof nvlDemande.employeId !== 'string' && '_id' in nvlDemande.employeId) {
    (nvlDemande.employeId as EmployePeuple).soldeConge = soldeConge;
  }

  return nvlDemande;
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

  if (demande.statut !== StatutDemande.REFUSE) {
    await UtilisateurRepository.mettreAJourSoldeConge(demande.employeId._id, +demande.nbJour);
  }

  return DemandeRepository.deleteDemandeCongeById(demandeId);
};


export async function getProfilUtilisateurResume(user: IUtilisateur) {
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
    role: user.role,
    isActive: user.isActive,
    nbJour: user.soldeConge,
    totalDemandes,
    totalJours,
    statsParStatut,
    statsParType,
    dernieresDemandes
  };
}


export const getStatsDashboard = async () => {
  const statsByStatut = await DemandeRepository.countByStatut();
  const statsByType = await DemandeRepository.countByType();

  return { statsByStatut, statsByType };
}