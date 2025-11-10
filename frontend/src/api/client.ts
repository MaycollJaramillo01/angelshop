import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/v1';

export const apiClient = axios.create({
  baseURL,
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
