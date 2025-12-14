import DemandeConge, { DemandeCongeInput, StatutDemande } from "../models/DemandeConge";

type FiltreDemande = Parameters<typeof DemandeConge.find>[0];

export const creerDemande = (data: DemandeCongeInput) => {
  const demande = new DemandeConge(data);
  return demande.save();
};

export const trouverParEmploye = (employeId: string) => {
  return DemandeConge
    .find({ employeId })
    .sort({ dateCreation: -1 });
};

export const trouverParId = (id: string) => {
  return DemandeConge.findById(id);
};

export const trouverDemandes = (filter: FiltreDemande) => {
  return DemandeConge
    .find(filter)
    .sort({ dateCreation: -1 });
};

export const changerStatut = async (id: string, statut: string) => {
  const demande = await DemandeConge.findById(id);
  if (!demande) return null;

  demande.statut = statut as StatutDemande;
  return demande.save();
};