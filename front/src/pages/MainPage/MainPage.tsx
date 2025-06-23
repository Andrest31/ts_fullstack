// src/pages/MainPage/MainPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import CatCard from '../../components/CatCard/CatCard';
import { toast } from 'react-toastify';
import './MainPage.module.css';
import axios from 'axios';

interface Cat {
  id: string;
  url: string;
}

const API_KEY = 'live_R5T2LCdpNrp1EaqRr73CNAS5YB0NuXcG2KY1Busj16g2kdMfTh1Mt92BknObWyW8';
const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=25&size=small';
const LOAD_TIMEOUT = 15000; 

// Скелетон для карточки кота
const CatCardSkeleton: React.FC = () => (
  <div className="cat-card-skeleton">
    <div className="skeleton-image"></div>
    <div className="skeleton-footer">
      <div className="skeleton-button"></div>
    </div>
  </div>
);

// Моковые данные на случай проблем с API
const mockCats: Cat[] = [
  { id: '1', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '2', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '3', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '4', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '5', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '6', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
];

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [likedCats, setLikedCats] = useState<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
  const fetchCats = async () => {
    setIsLoading(true);
    setError(null);
    
    // Устанавливаем таймаут
    timeoutRef.current = setTimeout(() => {
      setError('Превышено время ожидания загрузки. Временно используются моковые данные.');
      setCats(mockCats);
      setIsLoading(false);
    }, LOAD_TIMEOUT);

    try {
      const controller = new AbortController();
      const signal = controller.signal;
      
      const response = await fetch(API_URL, {
        headers: {
          'x-api-key': API_KEY
        },
        signal
      });
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить котиков');
      }
      
      const data = await response.json();
      clearTimeout(timeoutRef.current);
      
      setCats(data.map((cat: any) => ({
        id: cat.id,
        url: cat.url
      })));
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError('Ошибка при загрузке данных. Используются моковые данные.');
        console.error('API error:', err);
        setCats(mockCats);
      }
    } finally {
      clearTimeout(timeoutRef.current);
      setIsLoading(false);
    }
  };

  fetchCats();

  return () => {
    clearTimeout(timeoutRef.current);
  };
}, []);

useEffect(() => {
  const fetchUserLikes = async () => {
    if (!localStorage.getItem('access_token')) return;
    
    try {
      const response = await axios.get('http://localhost:3000/api/likes', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`
        }
      });
      
      const likedCatIds = response.data.map((like: any) => like.cat_id);
      setLikedCats(likedCatIds);
    } catch (error) {
      console.error('Error fetching user likes:', error);
    }
  };

  fetchUserLikes();
}, []);

  useEffect(() => {
    if (activeTab === 'favorites' && !localStorage.getItem('access_token')) {
      navigate('/auth');
    }
  }, [activeTab, navigate]);

  const handleTabChange = (tab: 'all' | 'favorites') => {
    if (tab === 'favorites' && !localStorage.getItem('access_token')) {
      navigate('/auth');
      toast.warn('Для доступа к этой функции необходима авторизация');
      return;
    }
    setActiveTab(tab);
  };

  const handleLikeToggle = (catId: string) => {
    if (!localStorage.getItem('access_token')) {
      navigate('/auth');
      toast.warn('Для доступа к этой функции необходима авторизация');
      return;
    }
    
    setLikedCats(prev => 
      prev.includes(catId) 
        ? prev.filter(id => id !== catId) 
        : [...prev, catId]
    );
  };

  const displayedCats = activeTab === 'all' 
    ? cats 
    : cats.filter(cat => likedCats.includes(cat.id));

  // Добавляем стили для скелетонов прямо в компонент (можно вынести в CSS модуль)
  const styles = `
    
    .cat-card-skeleton {
      background: #f0f0f0;
      border-radius: 8px;
      overflow: hidden;
      height: 227px;
      weight: 227px;
      position: relative;
    }
    
    .skeleton-image {
      width: 227px;
      height: 227px;
      background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    
    .no-cats-message{
      width: 350px;
    }
    
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `;

  return (
    <div className="app">
      <style>{styles}</style>
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="cats-container">
        {isLoading ? (
          // Показываем скелетоны во время загрузки
          Array.from({ length: 6 }).map((_, index) => (
            <CatCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : displayedCats.length > 0 ? (
          // Показываем карточки с котами
          displayedCats.map(cat => (
            <CatCard 
              key={cat.id} 
              cat={cat} 
              isLiked={likedCats.includes(cat.id)}
              onLikeToggle={handleLikeToggle}
            />
          ))
        ) : (
          // Если нет котов для отображения
          <div className="no-cats-message">
            {activeTab === 'favorites' ? 'У вас пока нет любимых котиков' : 'Не удалось загрузить котиков'}
          </div>
        )}
      </div>
      
      {error && toast.warn(error)}
    </div>
  );
};

export default MainPage;