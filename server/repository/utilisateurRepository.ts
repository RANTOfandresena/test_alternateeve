import { Utilisateur, IUtilisateur, Role, Genre } from "../models/Utilisateur";

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
      role: Role.MANAGER,
      genre: Genre.MASCULIN,
    });
  }

  return utilisateur;
};