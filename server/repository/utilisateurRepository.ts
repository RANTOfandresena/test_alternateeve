import { Utilisateur, IUtilisateur } from "../models/Utilisateur";

export const trouverParEmail = (email: string) => {
  return Utilisateur.findOne({ email });
};

export const creerUtilisateur = (data: Partial<IUtilisateur>) => {
  const utilisateur = new Utilisateur(data);
  return utilisateur.save();
};