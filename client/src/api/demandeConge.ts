import api from './axiosInstance';

export type DemandeCongePayload = {
  type?: 'VACANCES' | 'MALADIE' | 'MATERNITE' | 'PATERNITE' | 'FAMILIAL';
  dateDebut?: string;
  dateFin?: string;
  commentaire?: string;
  statut?:"EN_ATTENTE" | "ACCEPTE" | "REFUSE"
};

export const creerDemandeConge = async (payload: DemandeCongePayload) => {
  const { data } = await api.post('/demande-conge', payload);
  return data;
};

export type DemandeCongeItem = {
  _id?: string;
  type: "VACANCES" | "MALADIE" | "MATERNITE" | "PATERNITE" | "FAMILIAL" | undefined;
  dateDebut: string;
  dateFin: string;
  commentaire?: string;
  statut?: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';
  dateCreation?: string;
  employeId?: string;
};

export const getMesDemandesConge = async (params = '') => {
  const { data } = await api.get<DemandeCongeItem[]>('/demande-conge/me?' + params);
  return data;
};

export const getAllDemandesConge =  async () => {
  const { data } = await api.get<DemandeCongeItem[]>('/demande-conge/');
  return data;
}

export const accepterDemandeConge = async (id: string) => {
  const { data } = await api.patch<DemandeCongeItem>(`/demande-conge/${id}/accepter`);
  return data;
};

export const refuserDemandeConge = async (id: string) => {
  const { data } = await api.patch<DemandeCongeItem>(`/demande-conge/${id}/refuser`);
  return data;
};

export const updateDemandeConge = async (
  id: string,
  updateData: Partial<Omit<DemandeCongeItem, "statut">>
): Promise<DemandeCongeItem> => {
  const { data } = await api.patch<DemandeCongeItem>( `/demande-conge/${id}`,updateData);
  return data;
};

