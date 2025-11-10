import { apiClient } from './client.js';

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    nombre: string;
    email: string;
    rol: string;
  };
}

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post<LoginResponse>('auth/login', { email, password });
  return data;
};

export const refreshToken = async (token: string) => {
  const { data } = await apiClient.post<{ accessToken: string }>('auth/refresh', { refreshToken: token });
  return data;
};
