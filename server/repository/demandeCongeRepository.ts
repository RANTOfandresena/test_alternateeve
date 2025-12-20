import { Types } from "mongoose";
import DemandeConge, {
  DemandeCongeInput,
  IDemandeConge,
  StatutDemande
} from "../models/DemandeConge";

interface EmployePeuple {
  _id: string;
  nom: string;
  email: string;
}


async function normaliserStatut(demande: IDemandeConge) {
  if (
    demande.statut === StatutDemande.EN_ATTENTE &&
    demande.dateDebut < new Date()
  ) {
    demande.statut = StatutDemande.REFUSE;
    await demande.save();
  }
  return demande;
}

async function normaliserListe(demandes: IDemandeConge[]) {
  return Promise.all(demandes.map(normaliserStatut));
}


export const creerDemande = (data: DemandeCongeInput) => {
  const demande = new DemandeConge(data);
  return demande.save();
};

export const trouverParId = async (id: string) => {
  const demande = await DemandeConge.findById(id);
  if (!demande) return null;

  return normaliserStatut(demande);
};

export const findById = async (
  id: string,
  employeId: string | Types.ObjectId
): Promise<IDemandeConge | null> => {
  const demande = await DemandeConge.findOne({ _id: id, employeId }).exec();
  if (!demande) return null;

  return normaliserStatut(demande);
};

export const trouverDemandes = async (filter: any, search?: string) => {
  const demandes = await DemandeConge
    .find(filter)
    .populate("employeId", "nom email")
    .sort({ dateCreation: -1 });

  const normalisees = await normaliserListe(demandes);

  if (!search) return normalisees;

  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  return normalisees.filter((d) => {
    const employe = d.employeId as unknown as EmployePeuple | null;
    return (
      (d.commentaire && regex.test(d.commentaire)) ||
      (employe && regex.test(employe.nom)) ||
      (employe && regex.test(employe.email))
    );
  });
};

export const changerStatut = async (id: string, statut: string) => {
  const demande = await DemandeConge.findById(id);
  if (!demande) return null;

  demande.statut = statut as StatutDemande;
  return demande.save();
};

export const update = async (
  id: string,
  employeId: string | Types.ObjectId,
  updateData: Partial<DemandeCongeInput>
): Promise<IDemandeConge | null> => {
  const { statut, ...dataToUpdate } = updateData;

  const demande = await DemandeConge.findOneAndUpdate(
    { _id: id, employeId },
    { $set: { ...dataToUpdate, statut: StatutDemande.EN_ATTENTE } },
    { new: true }
  ).exec();

  if (!demande) return null;

  return normaliserStatut(demande);
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

  const demandes = await DemandeConge.find({
    employeId,
    dateDebut: { $gte: dateDebut },
    dateFin: { $lte: dateFin }
  }).sort({ dateDebut: 1 });

  return normaliserListe(demandes);
}

export async function getDemandesByUserId(
  employeId: Types.ObjectId | string
) {
  const demandes = await DemandeConge
    .find({ employeId })
    .sort({ dateCreation: -1 });

  return normaliserListe(demandes);
}