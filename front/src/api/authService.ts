// src/api/authService.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000/api/user';

export const authService = {
  async register(credentials: { login: string; password: string }) {
    try {
      const response = await axios.post(`${API_URL}`, credentials);
      
      // Сохраняем токены если они приходят в ответе
      if (response.data.access_token) {
        Cookies.set('access_token', response.data.access_token, {
          path: '/',
          sameSite: 'strict',
          expires: 1
        })
      }
      if (response.data.x_auth_token) {
        Cookies.set('x_auth_token', response.data.x_auth_token, {
          path: '/',
          sameSite: 'strict',
          expires: 1
        })
      }

      return { status: 'success', data: response.data };
    } catch (error: any) {
      if (error.response?.status === 409) {
        return { 
          status: 'error',
          error: 'Пользователь с таким логином уже существует'
        };
      }
      return { 
        status: 'error',
        error: error.response?.data?.message || 'Ошибка регистрации'
      };
    }
  },
};