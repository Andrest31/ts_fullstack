// components/Header/Header.tsx
import React from 'react';
import styles from './Header.module.css';

interface HeaderProps {
  activeTab: 'all' | 'favorites';
  onTabChange: (tab: 'all' | 'favorites') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => (
  <header className={styles.header}>
    <button 
      className={`${styles.tabButton} ${activeTab === 'all' ? styles.active : ''}`}
      onClick={() => onTabChange('all')}
    >
      Все котики
    </button>
    <button 
      className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.active : ''}`}
      onClick={() => onTabChange('favorites')}
    >
      Любимые котики
    </button>
  </header>
);

export default Header;