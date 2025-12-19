import { JourFerieDocument } from "../models/JourFerie";
import * as JourFerieRepository from "../repository/JourFerieRepository";

export const fetchOrGetJoursFeries = async (
  year: number,
  countryCode = "MG"
): Promise<JourFerieDocument[]> => {
  try {
    let jours = await JourFerieRepository.getJoursFeriesByYear(year);
    if (jours.length > 0) {
      return jours; 
    }

    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const apiJours: any[] = await response.json();

    if (!Array.isArray(apiJours)) {
      throw new Error("API returned invalid data");
    }

    const joursToInsert: Partial<JourFerieDocument>[] = apiJours.map(j => ({
      year,
      date: j.date,
      name: j.localName,
    }));

    jours = await JourFerieRepository.insertJoursFeries(joursToInsert);

    return jours;
  } catch (err: any) {
    console.error("Erreur fetchOrGetJoursFeries:", err.message);
    throw err;
  }
};