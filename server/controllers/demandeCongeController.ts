import { Request, Response } from "express";
import * as DemandeService from "../services/demandeCongeService";
import { Types } from "mongoose";

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
    const demandes = await DemandeService.recupererDemandes({...req.query,employeId : user.employeId});
    res.json(demandes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllDemandes = async (req: Request, res: Response) => {
  try {
    const demandes = await DemandeService.recupererDemandes(req.query);
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

export const updateDemande = async (req: Request, res: Response) => {
  try {
    const employeId = req.user._id.toString();
    const demandeId = req.params.id;
    const updateData = req.body;

    const updatedDemande = await DemandeService.updateDemande(demandeId, employeId, updateData);

    return res.status(200).json({ message: "Demande mise à jour avec succès", updatedDemande });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}

export const deleteDemandeConge = async (
  req: Request,
  res: Response
) => {
  try {
    await DemandeService.deleteDemandeCongeService(req.params.id, req.user._id.toString());
    res.status(204).send();
  } catch (e: any) {
    res.status(403).json({ message: e.message });
  }
};

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = await DemandeService.getStatsDashboard();
    res.json(stats);
  } catch (error) {
    console.error("Erreur récupération stats dashboard:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};