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

  if (filtres.isActive) {
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