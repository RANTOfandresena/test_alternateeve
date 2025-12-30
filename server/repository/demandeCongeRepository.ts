import { Types } from "mongoose";
import DemandeConge, {
  DemandeCongeInput,
  IDemandeConge,
  StatutDemande,
  TypeConge
} from "../models/DemandeConge";
import * as UtilisateurRepository from "./utilisateurRepository";

export interface EmployePeuple {
  _id: string;
  nom: string;
  email: string;
  soldeConge: number;
}

async function normaliserStatut(demande: IDemandeConge) {
  if (
    demande.statut === StatutDemande.EN_ATTENTE &&
    demande.dateDebut < new Date()
  ) {
    demande.statut = StatutDemande.REFUSE;
    demande._ignoreSoldeCheck = true
    await demande.save();

    const employeId = (demande.employeId as EmployePeuple)._id;
    await UtilisateurRepository.mettreAJourSoldeConge(employeId, +demande.nbJour);
  }

  if (demande.employeId && !(demande.employeId as EmployePeuple).soldeConge) {
    const employe = await UtilisateurRepository.trouverParId(demande.employeId._id as Types.ObjectId);
    if (employe) {
      demande.employeId = {
        _id: employe._id.toString(),
        nom: employe.nom,
        email: employe.email,
        soldeConge: employe.soldeConge,
      };
    }
  }

  return demande;
}

async function normaliserListe(demandes: IDemandeConge[]) {
  return Promise.all(demandes.map(normaliserStatut));
}

export const creerDemande = async (data: DemandeCongeInput) => {
  const demande = new DemandeConge(data);
  return normaliserStatut(await demande.save());
};

export const trouverParId = async (id: string) => {
  const demande = await DemandeConge.findById(id).populate("employeId", "_id nom email soldeConge");
  if (!demande) return null;
  return normaliserStatut(demande);
};

export const findById = async (
  id: string,
  employeId: string | Types.ObjectId
): Promise<IDemandeConge | null> => {
  const demande = await DemandeConge
    .findOne({ _id: id, employeId })
    .populate("employeId", "_id nom email soldeConge")
    .exec();
  if (!demande) return null;
  return normaliserStatut(demande);
};

export const trouverDemandes = async (filter: any, search?: string) => {
  const demandes = await DemandeConge
    .find(filter)
    .populate("employeId", "_id nom email soldeConge")
    .sort({ dateCreation: -1 });

  const normalisees = await normaliserListe(demandes);

  if (!search) return normalisees;

  const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(escaped, "i");

  return normalisees.filter((d) => {
    const employe = d.employeId as EmployePeuple | null;
    return (
      (d.commentaire && regex.test(d.commentaire)) ||
      (employe && regex.test(employe.nom)) ||
      (employe && regex.test(employe.email))
    );
  });
};

export const changerStatut = async (id: string, statut: string) => {
  const demande = await DemandeConge.findById(id).populate("employeId", "_id nom email soldeConge");
  if (!demande) return null;

  demande.statut = statut as StatutDemande;
  return normaliserStatut(await demande.save());
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
  )
    .populate("employeId", "_id nom email soldeConge")
    .exec();

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
  })
    .populate("employeId", "_id nom email soldeConge")
    .sort({ dateDebut: 1 });

  return normaliserListe(demandes);
}

export async function getDemandesByUserId(
  employeId: Types.ObjectId | string
) {
  const demandes = await DemandeConge
    .find({ employeId })
    .populate("employeId", "_id nom email soldeConge")
    .sort({ dateCreation: -1 });

  return normaliserListe(demandes);
}


export const countByStatut= async (): Promise<Record<string, number>> => {
  const pending = await DemandeConge.countDocuments({ statut: StatutDemande.EN_ATTENTE });
  const accepted = await DemandeConge.countDocuments({ statut: StatutDemande.ACCEPTE });
  const refused = await DemandeConge.countDocuments({ statut: StatutDemande.REFUSE });
  const total = await DemandeConge.countDocuments();

  return { pending, accepted, refused, total };
}

export const countByType= async (): Promise<Record<string, number>> => {
  const vacances = await DemandeConge.countDocuments({ type: TypeConge.VACANCES });
  const maladie = await DemandeConge.countDocuments({ type: TypeConge.MALADIE });
  const absence = await DemandeConge.countDocuments({ type: TypeConge.ABSENCE });

  return { VACANCES: vacances, MALADIE: maladie, ABSENCE: absence };
}