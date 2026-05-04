import axios from 'axios';

export const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
    return Promise.reject(error);
  },
);

export const getApiError = (error) => {
  if (!error.response) {
    return 'No se pudo conectar con la API. Verifica que el backend esté corriendo en http://localhost:3000.';
  }

  return (
    error.response?.data?.error ||
    error.response?.data?.message ||
    error.response?.data?.mensaje ||
    'No se pudo completar la operación.'
  );
};

export default api;
