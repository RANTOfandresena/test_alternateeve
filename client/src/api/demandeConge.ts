import api from './axiosInstance';

export type DemandeCongePayload = {
  type: 'VACANCES' | 'MALADIE' | 'MATERNITE' | 'PATERNITE' | 'FAMILIAL';
  dateDebut: string;
  dateFin: string;
  commentaire?: string;
};

export const creerDemandeConge = async (payload: DemandeCongePayload) => {
  const { data } = await api.post('/demande-conge', payload);
  return data;
};

export type DemandeCongeItem = {
  _id: string;
  type: DemandeCongePayload['type'];
  dateDebut: string;
  dateFin: string;
  commentaire?: string;
  statut: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';
  dateCreation: string;
};

export const getMesDemandesConge = async () => {
  const { data } = await api.get<DemandeCongeItem[]>('/demande-conge/me');
  return data;
};

export const getAllDemandesConge =  async () => {
  const { data } = await api.get<DemandeCongeItem[]>('/demande-conge/');
  return data;
}


