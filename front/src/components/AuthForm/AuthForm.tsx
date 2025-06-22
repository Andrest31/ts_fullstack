// src/components/AuthForm/AuthForm.tsx
import React, { useState } from 'react';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  onLogin: (username: string, password: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className={styles.authContainer}>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <h2 className={styles.authTitle}>Вход в систему</h2>
        <div className={styles.formGroup}>
          <input
            type="text"
            placeholder="Логин"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.authInput}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.authInput}
            required
          />
        </div>
        <button type="submit" className={styles.authButton}>
          Войти
        </button>
      </form>
    </div>
  );
};

export default AuthForm;