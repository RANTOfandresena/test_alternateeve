import api from './axiosInstance';
import {type UserInfo } from '../features/authSlice'


export interface LoginResponse {
  token: string;
  user: UserInfo;
}

export const login = async (codeResponse: string) => {
  const { data } = await api.post('http://localhost:3000/auth/google', {
    code: codeResponse,
  });
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

