import { Types } from "mongoose";
import DemandeConge from "../models/DemandeConge";
import { Utilisateur, IUtilisateur, Role, Genre } from "../models/Utilisateur";
import dotenv from "dotenv";

dotenv.config();

export const trouverParEmail = (email: string) => {
  return Utilisateur.findOne({ email });
};

export const creerUtilisateur = (data: Partial<IUtilisateur>) => {
  const utilisateur = new Utilisateur(data);
  return utilisateur.save();
};

export const findOrCreateByEmail = async (
  email: string,
  nom: string
): Promise<IUtilisateur> => {

  let utilisateur = await Utilisateur.findOne({ email });

  if (!utilisateur) {
    utilisateur = await Utilisateur.create({
      email,
      nom,
      motDePasse: null,
      role: email === process.env.EMAIL_USER ? Role.MANAGER : Role.EMPLOYE,
      genre: Genre.MASCULIN,
      isActive: email === process.env.EMAIL_USER
    });
  }

  return utilisateur;
};

export type FiltreUtilisateur = {
  role?: string;
  isActive?: boolean;
  search?: string;
};

export const trouverUtilisateursPagine = async (
  page: number,
  limit: number,
  filtres: FiltreUtilisateur
) => {
  const skip = (page - 1) * limit;
  const query: any = {};

  if (filtres.role) {
    query.role = filtres.role;
  }

  if ('isActive' in filtres) {
    query.isActive = filtres.isActive;
  }

  if (filtres.search?.trim()) {
    query.$or = [
      { nom: { $regex: filtres.search, $options: "i" } },
      { email: { $regex: filtres.search, $options: "i" } }
    ];
  }

  const [utilisateurs, total] = await Promise.all([
    Utilisateur.find(query)
      .select("-motDePasse")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Utilisateur.countDocuments(query)
  ]);
   
  return { utilisateurs, total };
};
export const mettreAJourRoleUtilisateur = (userId: string, role: Role) => {
  return Utilisateur.findByIdAndUpdate(userId, { role ,isActive: true }, { new: true });
};

export const findByIds = (ids: string[]): Promise<IUtilisateur[]> => {
  return Utilisateur.find({ _id: { $in: ids } });
};
export const trouverParId = async (id: Types.ObjectId | string) => {
  return await Utilisateur.findById(id);
}
export const mettreAJourSoldeConge = async (
  utilisateurId: Types.ObjectId | string,
  delta: number
) => {
  if (delta === 0) return;

  const utilisateur = await Utilisateur.findById(utilisateurId);

  if (!utilisateur) {
    throw new Error("Utilisateur introuvable");
  }
  console.log("-----------------------------------------------")
  console.log("encien:",utilisateur.soldeConge,"delta:",delta)
  const nouveauSolde = utilisateur.soldeConge + delta;

  if (nouveauSolde < 0) {
    throw new Error("Solde de congé insuffisant");
  }

  utilisateur.soldeConge = nouveauSolde;
  await utilisateur.save();
  console.log("nouveauSolde:",utilisateur.soldeConge)
  console.log("---------------------------------------------")
  return utilisateur.soldeConge;
};

export const updateUtilisateurById = (id: string,  data: IUtilisateur) => {
  return Utilisateur.findByIdAndUpdate(
    id,
    {
      $set: {
        role: data.role,
        isActive: data.isActive,
        soldeConge: data.soldeConge,
      },
    },
    { new: true }
  ).exec();
};

