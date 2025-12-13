import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:4000/v1';
export const REALTIME_ENDPOINT = API_BASE_URL.replace(/\/v1\/?$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
);
