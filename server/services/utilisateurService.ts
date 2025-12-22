import jwt from "jsonwebtoken";
import { Role, IUtilisateur } from "../models/Utilisateur";
import * as UtilisateurRepository from "../repository/utilisateurRepository";
import { FiltreUtilisateur } from "../repository/utilisateurRepository";

const JWT_SECRET = process.env.JWT_SECRET || "cle";

export type UpdateUtilisateurDto = {
  role: IUtilisateur["role"];
  isActive: boolean;
  soldeConge: number;
};

export const login = async (email: string, motDePasse: string) => {
  const utilisateur = await UtilisateurRepository.trouverParEmail(email);

  if (!utilisateur) throw new Error("Email ou mot de passe incorrect");

  const isMatch = await utilisateur.comparePassword(motDePasse);
  if (!isMatch) throw new Error("Email ou mot de passe incorrect");

  if (!utilisateur.isActive) throw new Error("Le compte n'est pas actif. Veuillez contacter l'administrateur.");

  const token = jwt.sign({ id: utilisateur._id }, JWT_SECRET, { expiresIn: "24h" });

  return {
    token,
    user: utilisateur
  };
};

export const register = async (data: {
  nom: string;
  email: string;
  motDePasse: string;
}) => {
  const utilisateur = await UtilisateurRepository.creerUtilisateur({
    nom: data.nom,
    email: data.email,
    motDePasse: data.motDePasse,
    role: Role.EMPLOYE,
  });

  return { message: "Utilisateur créé !", utilisateur };
};

export const recupererUtilisateurs = async (
  page: number,
  limit: number,
  filtres: FiltreUtilisateur
) => {
  const { utilisateurs, total } = await UtilisateurRepository.trouverUtilisateursPagine(
    page,
    limit,
    filtres
  );

  return {
    data: utilisateurs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
export const mettreAJourRoleUtilisateurService = async (userId: string, role: Role) => {
  const utilisateur = await UtilisateurRepository.mettreAJourRoleUtilisateur(userId, role);
  if (!utilisateur) throw new Error("Utilisateur non trouvé");
  return utilisateur;
};

export const getUsersFromIds= async (id_users: string[]): Promise<IUtilisateur[]> => {
  return UtilisateurRepository.findByIds(id_users);
}

export const updateUtilisateur = async (
  id: string,
  data: UpdateUtilisateurDto
) => {
  if (data.soldeConge < 0) {
    throw new Error("Le solde de congé ne peut pas être négatif");
  }


  const utilisateur = await UtilisateurRepository.updateUtilisateurById(
    id,
    data
  );
  if (!utilisateur) {
    throw new Error("Utilisateur introuvable");
  }

  return utilisateur;
};
