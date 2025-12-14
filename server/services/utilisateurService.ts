import jwt from "jsonwebtoken";
import { Role, IUtilisateur, Genre } from "../models/Utilisateur";
import * as UtilisateurRepository from "../repository/utilisateurRepository";

const JWT_SECRET = process.env.JWT_SECRET || "cle";

export const login = async (email: string, motDePasse: string) => {
  const utilisateur = await UtilisateurRepository.trouverParEmail(email);
  if (!utilisateur) throw new Error("Email ou mot de passe incorrect");

  const isMatch = await utilisateur.comparePassword(motDePasse);
  if (!isMatch) throw new Error("Email ou mot de passe incorrect");

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
  role?: Role;
  genre: string;
}) => {
  const utilisateur = await UtilisateurRepository.creerUtilisateur({
    nom: data.nom,
    email: data.email,
    genre: data.genre as Genre,
    motDePasse: data.motDePasse,
    role: data.role as Role ?? Role.EMPLOYE,
  });

  return { message: "Utilisateur créé !", utilisateur };
};