import api from "./axiosInstance";

export interface IJourFerie {
  year: number;
  date: string;
  name: string;
}
export const getJoursFeriesByYear =  async (year:string) => {
  const { data } = await api.get<IJourFerie[]>(`/Jour-ferie/${year}`);
  return data;
}