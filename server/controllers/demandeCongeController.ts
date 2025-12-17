import { Request, Response } from "express";
import * as DemandeService from "../services/demandeCongeService";
import { Types } from "mongoose";
import DemandeConge from "../models/DemandeConge";

export const createDemande = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const demande = await DemandeService.creerDemande({
      employeId: new Types.ObjectId(user._id),
      ...req.body,
    });

    res.status(201).json(demande);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const getMyDemandes = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const demandes = await DemandeService.recupererMesDemandes(user._id);
    res.json(demandes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllDemandes = async (req: Request, res: Response) => {
  try {
    const demandes = await DemandeService.recupererDemandes(req.query);
    console.log(demandes);
    res.json(demandes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const accepterDemande = async (req: Request, res: Response) => {
  try {
    const demande = await DemandeService.accepterDemande(req.params.id);
    if (!demande) return res.status(404).json({ message: "Demande non trouvée" });
    res.json(demande);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const refuserDemande = async (req: Request, res: Response) => {
  try {
    const demande = await DemandeService.refuserDemande(req.params.id);
    if (!demande) return res.status(404).json({ message: "Demande non trouvée" });
    res.json(demande);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};