import api from './axiosInstance';
import {type UserInfo } from '../features/authSlice'


export interface LoginResponse {
  token: string;
  user: UserInfo;
}
export interface LoginRequest { 
  email: string;
  motDePasse: string;
}

export const loginGoogle = async (codeResponse: string) => {
  const { data } = await api.post('http://localhost:3000/auth/google', {
    code: codeResponse,
  });
  return data;
};
export const login = async (from: LoginRequest) => {
  const { data } = await api.post('http://localhost:3000/auth/login', {
    from,
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

