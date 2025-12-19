import { JourFerieDocument, JourFerieModel } from "../models/JourFerie";


export const getJoursFeriesByYear = async (year: number): Promise<JourFerieDocument[]> => {
  return JourFerieModel.find({ year }).sort({ date: 1 }).exec();
};

export const insertJoursFeries = async (jours: Partial<JourFerieDocument>[]): Promise<JourFerieDocument[]> => {
  return JourFerieModel.insertMany(jours, { ordered: false });
};