import { Types } from "mongoose";
import DemandeConge, { DemandeCongeInput, IDemandeConge, StatutDemande } from "../models/DemandeConge";

type FiltreDemande = Parameters<typeof DemandeConge.find>[0];

export const creerDemande = (data: DemandeCongeInput) => {
  const demande = new DemandeConge(data);
  return demande.save();
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

export const findById = async (
  id: string,
  employeId: string | Types.ObjectId
): Promise<IDemandeConge | null> => {
  return await DemandeConge.findOne({ _id: id, employeId }).exec();
};

export const update = async (
  id: string,
  employeId: string | Types.ObjectId,
  updateData: Partial<DemandeCongeInput>
): Promise<IDemandeConge | null> => {
  const { statut, ...dataToUpdate } = updateData;
  return DemandeConge.findOneAndUpdate(
    { _id: id, employeId },
    { $set: {...dataToUpdate, statut: StatutDemande.EN_ATTENTE} },
    { new: true }
  ).exec();
};

export const deleteDemandeCongeById = (id: string) => {
  return DemandeConge.findByIdAndDelete(id);
};

export async function trouverDemandesInclusesEntreDeuxDates(params: {
  employeId: Types.ObjectId | string;
  dateDebut: Date;
  dateFin: Date;
}) {
  const { employeId, dateDebut, dateFin } = params;

  return DemandeConge.find({
    employeId,
    dateDebut: { $gte: dateDebut },
    dateFin: { $lte: dateFin }
  }).sort({ dateDebut: 1 });
}