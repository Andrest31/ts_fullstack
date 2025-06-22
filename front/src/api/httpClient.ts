// src/api/httpClient.ts
import axios, { AxiosRequestHeaders } from 'axios';
import { authService } from './authService';

const httpClient = axios.create({
  baseURL: 'http://localhost:3000'
});

// Интерсептор для добавления заголовков
httpClient.interceptors.request.use((config) => {
  const authHeaders = authService.getAuthHeaders();
  
  // Правильное объединение заголовков
  config.headers = {
    ...config.headers,
    ...authHeaders
  } as AxiosRequestHeaders; // Явное приведение типа
  
  return config;
});

export default httpClient;