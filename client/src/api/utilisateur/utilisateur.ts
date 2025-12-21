import type { GetUsersResponse } from "../../utils/type";
import api from "../axiosInstance";
import type { DemandeCongeItem } from "../demandeConge";

type GetUsersParams = {
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  search?: string;
};
export interface ProfilUtilisateur {
  id: string;
  nom: string;
  email: string;
  genre: 'MASCULIN' | 'FEMININ';
  role: 'EMPLOYE' | 'MANAGER';
  isActive: boolean;
  nbJour: number;
  totalDemandes: number;
  totalJours: number;
  statsParStatut: Record<'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE', number>;
  statsParType: Record<'VACANCES' | 'MALADIE' | 'ABSENCE', number>;
  dernieresDemandes: DemandeCongeItem[];
}
export const getAllUsers = async (
  params?: GetUsersParams
): Promise<GetUsersResponse> => {
  const { data } = await api.get<GetUsersResponse>("/utilisateur", {
    params
  });

  return data;
};
export const updateUserRole = async (
  userId: string,
  role: string
): Promise<void> => {
  await api.put(`/utilisateur/${userId}/role`, { role });
};

export const fetchUsersFromIds = async (ids: string[]) => {
  const { data } = await api.post('utilisateur/from-ids', { id_users: ids });
  return data;
};

export const getProfilUtilisateur = async (): Promise<ProfilUtilisateur> => {
  const { data } = await api.get('utilisateur/me');
  return data;
}