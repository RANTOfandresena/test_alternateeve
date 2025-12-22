

import { Request, Response } from "express";
import * as UtilisateurService from "../services/utilisateurService";
import * as DemandeService from "../services/demandeCongeService";

export const allUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const filtres = {
      role: req.query.role as string,
      search: req.query.search as string,
      isActive:
        req.query.isActive !== undefined
          ? req.query.isActive === "true"
          : undefined
    };

    const result = await UtilisateurService.recupererUtilisateurs(page, limit, filtres);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs"
    });
  }
};
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const updatedUser = await UtilisateurService.mettreAJourRoleUtilisateurService(userId, role);

    res.status(200).json({
      message: "Rôle utilisateur mis à jour avec succès",
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la mise à jour du rôle utilisateur"
    });
  }
};
export const getUsersFromIds = async (req: Request, res: Response) => {
  try {
    const idUser: string[] = req.body.id_users;
    if (!idUser) return res.status(400).json({ message: 'Aucun congé fourni' });

    const users = await UtilisateurService.getUsersFromIds(idUser);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export async function getProfilController(req: Request, res: Response) {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const profil = await DemandeService.getProfilUtilisateurResume(user);
    res.json(profil);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}

export const updateUtilisateurController = async (req: Request,res: Response) => {
  try {
    const { id } = req.params;
    const { role, isActive, soldeConge } = req.body.update;
    const utilisateur = await UtilisateurService.updateUtilisateur(id, {
      role,
      isActive,
      soldeConge,
    });

    return res.status(200).json(utilisateur);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};