import api from './axiosInstance';
import {type UserInfo } from '../features/authSlice'

export interface LoginPayload {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  token: string;
  user: UserInfo;
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

