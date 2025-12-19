import { Request, Response } from "express";
import * as JourFerieService from "../services/JourFerieService";


export const getJoursFeriesController = async (req: Request, res: Response) => {
  const yearParam = req.params.year;
  const year = parseInt(yearParam, 10);

  if (isNaN(year)) {
    return res.status(400).json({ error: "Année invalide" });
  }

  try {
    const jours = await JourFerieService.fetchOrGetJoursFeries(year, "MG");
    res.json(jours);
  } catch (err: any) {
    console.error("Erreur getJoursFeriesController:", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};