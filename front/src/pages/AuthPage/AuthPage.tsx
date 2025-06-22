// src/pages/AuthPage/AuthPage.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./AuthPage.module.css"
import { authService } from '../../api/authService';
import { useNavigate } from 'react-router-dom';

const AuthPage: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await authService.login({ login, password });
    
    if (result.status === 'success') {
      toast.success('Авторизация успешна!');
      navigate('/'); 
    } else {
      toast.error('Неизвестная ошибка');
    }

    setIsLoading(false);
  };

  return (
    <div style={{
      minWidth: '400px',
      minHeight: '300px',
      margin: '50px auto',
      padding: '20px',
      background: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ color: '#4a76a8', textAlign: 'center' }}>Авторизация</h2>
      
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #d3d9de',
            borderRadius: '4px',
            fontSize: '16px'
          }}
          required
        />
        
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: '12px',
            border: '1px solid #d3d9de',
            borderRadius: '4px',
            fontSize: '16px'
          }}
          required
        />
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            background: '#4a76a8',
            color: 'white',
            padding: '12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '20px',
            fontSize: '16px'
          }}
        >
          {isLoading ? 'Отправка...' : 'Войти'}
        </button>
      </form>
    </div>
  );
};

export default AuthPage;