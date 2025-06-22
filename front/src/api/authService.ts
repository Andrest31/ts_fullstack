// src/api/authService.ts
import axios, { AxiosRequestHeaders } from 'axios';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:3000/api/user';

export const authService = {
  async login(credentials: { login: string; password: string }) {
    try {
      const response = await axios.post(API_URL, credentials, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Сохраняем токены
      if (response.headers['authorization']) {
        localStorage.setItem('access_token', response.headers['authorization'].split(' ')[1]);
      }
      if (response.headers['x-auth-token']) {
        localStorage.setItem('x_auth_token', response.headers['x-auth-token']);
      }

      return {
        status: 'success',
        data: response.data
      };
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ошибка авторизации');
      return {
        status: 'error',
        error: error.message
      };
    }
  },

  getAuthHeaders(): AxiosRequestHeaders {
    const headers: AxiosRequestHeaders = new axios.AxiosHeaders();
    headers.set('Authorization', `Bearer ${localStorage.getItem('access_token')}`);
    headers.set('X-Auth-Token', localStorage.getItem('x_auth_token') || '');
    return headers;
  }
};