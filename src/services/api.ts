import axios from 'axios';
import { Superhero } from '../types/superhero';

const API_URL = 'https://codetest-api.applivery.io';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const createApiKey = async () => {
  try {
    const response = await axios.post(`${API_URL}/api-keys/`, {});
    console.log(response.data);
    return response.data.id;
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

export const setApiKey = (key: any) => {
  localStorage.setItem('apiKey', key);
  api.defaults.headers['Authorization'] = key;
};

export const getStoredApiKey = () => {
  return localStorage.getItem('apiKey');
};

export const initializeApi = async () => {
  let apiKey = getStoredApiKey();
  if (!apiKey) {
    apiKey = await createApiKey();
    setApiKey(apiKey);
  }
  return apiKey;
};

api.interceptors.request.use((config) => {
  const apiKey = getStoredApiKey();
  if (apiKey) {
    config.headers['Authorization'] = apiKey;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const newApiKey = await createApiKey();
      setApiKey(newApiKey);
      error.config.headers['Authorization'] = newApiKey;
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export const getHeroes = async () => {
  await initializeApi();
  try {
    const response = await api.get('/pentathlon/heroes/');
    return response.data;
  } catch (error) {
    console.error('Error fetching heroes:', error);
    throw error;
  }
};

export const createHero = async (hero: Omit<Superhero, 'id' | 'createdAt' | 'updatedAt'>) => {
  await initializeApi();
  try {
    const response = await api.post('/pentathlon/heroes/', hero);
    return response.data;
  } catch (error) {
    console.error('Error creating hero:', error);
    throw error;
  }
};

export const updateHero = async (id: string, hero: Omit<Superhero, 'id' | 'createdAt' | 'updatedAt'>) => {
  await initializeApi();
  try {
    const response = await api.put(`/pentathlon/heroes/${id}`, hero);
    return response.data;
  } catch (error) {
    console.error('Error updating hero:', error);
    throw error;
  }
};

export const deleteHero = async (id: string) => {
  await initializeApi();
  try {
    const response = await api.delete(`/pentathlon/heroes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting hero:', error);
    throw error;
  }
};