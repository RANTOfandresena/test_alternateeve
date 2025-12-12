import api from './axiosInstance';

export interface LoginPayload {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    nom: string;
    email: string;
  };
}

export const login = async (payload: LoginPayload) => {
  const { data } = await api.post<LoginResponse>('/auth/login', payload);
  return data;
};

export interface RegisterPayload {
  nom: string;
  email: string;
  motDePasse: string;
  role?: string;
}

export const register = async (payload: RegisterPayload) => {
  const { data } = await api.post('/auth/register', payload);
  return data as { message: string };
};

