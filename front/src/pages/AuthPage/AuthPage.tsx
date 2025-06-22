// src/pages/AuthPage/AuthPage.tsx
import React from 'react';
import styles from './AuthPage.module.css';

const AuthPage: React.FC = () => {
  return (
    <div className={styles.authPage}>
      <h2 className={styles.title}>Вход в систему</h2>
      <form className={styles.form}>
        <input 
          type="text" 
          placeholder="Логин" 
          className={styles.input}
        />
        <input 
          type="password" 
          placeholder="Пароль" 
          className={styles.input}
        />
        <button type="submit" className={styles.button}>
          Войти
        </button>
      </form>
    </div>
  );
};

export default AuthPage;