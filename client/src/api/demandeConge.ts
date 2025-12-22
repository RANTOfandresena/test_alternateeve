import api from './axiosInstance';

export type DemandeCongePayload = {
  type?: 'VACANCES' | 'MALADIE' | 'MATERNITE' | 'PATERNITE' | 'FAMILIAL';
  dateDebut?: string;
  dateFin?: string;
  commentaire?: string;
  statut?:"EN_ATTENTE" | "ACCEPTE" | "REFUSE"
};
type Employe = {
  _id: string;
  nom: string;
  email: string;
  soldeConge: number;
}

export interface DemandeCongeParams {
  statut?: string;
  employeId?: string;
  dateDu?: string;
  dateAu?: string;
  search?: string;
}
export type DemandeCongeItem = {
  _id?: string;
  type: "VACANCES" | "MALADIE" | "MATERNITE" | "PATERNITE" | "FAMILIAL" | undefined;
  dateDebut: string;
  dateFin: string;
  commentaire?: string;
  statut?: 'EN_ATTENTE' | 'ACCEPTE' | 'REFUSE';
  nbJour?: number;
  dateCreation?: string;
  employeId?: Employe;
};
export interface DashboardStats {
  statsByStatut: {
    pending: number;
    accepted: number;
    refused: number;
    total: number;
  };
  statsByType: {
    VACANCES: number;
    MALADIE: number;
    ABSENCE: number;
  };
}

type UpdateDemandeResponse = {
  message: string;
  updatedDemande: DemandeCongeItem;
};

export const creerDemandeConge = async (payload: DemandeCongePayload) => {
  const { data } = await api.post('/demande-conge', payload);
  return data;
};

export const getMesDemandesConge = async (params = '') => {
  const { data } = await api.get<DemandeCongeItem[]>('/demande-conge/me?' + params);
  return data;
};
export const getAllDemandesCongeFiltre = async (params?: DemandeCongeParams) => {
  const { data } = await api.get<DemandeCongeItem[]>('/demande-conge/me', { params });
  return data;
};
export const getAllDemandesConge = async (params?: DemandeCongeParams) => {
  console.log(params)
  const { data } = await api.get<DemandeCongeItem[]>('/demande-conge/', { params });
  return data;
};

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
  const { data } = await api.patch<UpdateDemandeResponse>( `/demande-conge/${id}`,updateData);
  return data.updatedDemande;
};

export const deleteDemandeConge = async (id: string): Promise<void> => {
  await api.delete(`/demande-conge/${id}`);
};


export const getDashboardStats = async (): Promise<DashboardStats> => {
  const {data} = await api.get<DashboardStats>("/demande-conge/dashboard-stats");
  return data;
};