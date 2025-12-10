import axios from 'axios';
import type { RootState } from '../store';

let storeRef: { getState: () => RootState } | null = null;

export const setStore = (store: { getState: () => RootState }) => {
  storeRef = store;
};

const api = axios.create({ baseURL: 'http://localhost:3000' });

api.interceptors.request.use((config) => {
  const token = storeRef?.getState().auth.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;