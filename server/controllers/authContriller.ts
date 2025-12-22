import { Request, Response } from "express";
import * as UtilisateurService from "../services/utilisateurService";
import { Utilisateur } from "../models/Utilisateur";
import DemandeConge from "../models/DemandeConge";

export const login = async (req: Request, res: Response) => {
  try {
    // await Utilisateur.deleteMany({})
    // await DemandeConge.deleteMany({})
    const { email, motDePasse } = req.body.from;
    const result = await UtilisateurService.login(email, motDePasse);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { nom, email, motDePasse } = req.body;
    const result = await UtilisateurService.register({ nom, email, motDePasse });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};