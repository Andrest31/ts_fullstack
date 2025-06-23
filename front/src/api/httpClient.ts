// src/api/httpClient.ts
import axios, { AxiosRequestHeaders } from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

// Интерсептор для добавления заголовков
httpClient.interceptors.request.use((config) => {
  
  // Правильное объединение заголовков
  config.headers = {
    ...config.headers,
  } as AxiosRequestHeaders; // Явное приведение типа
  
  return config;
});

export default httpClient;