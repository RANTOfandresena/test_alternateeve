import { Request, Response } from 'express';
import DemandeConge, { StatutDemande } from '../models/DemandeConge';

export const createDemande = async (req: Request, res: Response) => {
  try {
    const { type, dateDebut, dateFin, commentaire } = req.body;
    const user = (req as any).user;

    if (!type || !dateDebut || !dateFin) {
      return res.status(400).json({ message: 'Champs requis manquants' });
    }

    const demande = new DemandeConge({
      employeId: user!._id,
      type,
      dateDebut,
      dateFin,
      commentaire,
      statut: StatutDemande.EN_ATTENTE,
    });

    await demande.save();
    res.status(201).json(demande);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur lors de la création de la demande', error: err.message });
  }
};

export const getMyDemandes = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const demandes = await DemandeConge.find({ employeId: user!._id }).sort({ dateCreation: -1 });
    res.json(demandes);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes', error: err.message });
  }
};

export const getAllDemandes = async (req: Request, res: Response) => {
  try {
    const { statut, employeId } = req.query;
    const filter: any = {};
    if (statut && Object.values(StatutDemande).includes(statut as any)) {
      filter.statut = statut;
    }
    if (employeId) {
      filter.employeId = employeId;
    }
    const demandes = await DemandeConge.find(filter).sort({ dateCreation: -1 });
    res.json(demandes);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes', error: err.message });
  }
};

export const accepterDemande = async (req: Request, res: Response) => {
  try {
    const demande = await DemandeConge.findById(req.params.id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    demande.statut = StatutDemande.ACCEPTE;
    await demande.save();
    res.json(demande);
  } catch (err: any) {
    res.status(500).json({ message: "Erreur lors de l'acceptation", error: err.message });
  }
};

export const refuserDemande = async (req: Request, res: Response) => {
  try {
    const demande = await DemandeConge.findById(req.params.id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }
    demande.statut = StatutDemande.REFUSE;
    await demande.save();
    res.json(demande);
  } catch (err: any) {
    res.status(500).json({ message: 'Erreur lors du refus', error: err.message });
  }
};
