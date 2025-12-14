import { Request, Response } from "express";
import * as UtilisateurService from "../services/utilisateurService";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, motDePasse } = req.body;
    const result = await UtilisateurService.login(email, motDePasse);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { nom, email, genre, motDePasse, role } = req.body;
    const result = await UtilisateurService.register({ nom, email, genre, motDePasse, role });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};