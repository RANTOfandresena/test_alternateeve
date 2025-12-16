

import { Request, Response } from "express";
import * as UtilisateurService from "../services/utilisateurService";

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
