// src/pages/MainPage/MainPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import CatCard from '../../components/CatCard/CatCard';
import { toast } from 'react-toastify';
import './MainPage.module.css';

interface Cat {
  id: string; // Изменяем тип id на string, так как API использует строковые ID
  url: string;
}

const API_KEY = 'live_R5T2LCdpNrp1EaqRr73CNAS5YB0NuXcG2KY1Busj16g2kdMfTh1Mt92BknObWyW8';
const API_URL = 'https://api.thecatapi.com/v1/images/search?limit=40&size=small';

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Моковые данные на случай проблем с API
  const mockCats: Cat[] = [
    { id: '1', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
    { id: '2', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
    { id: '3', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
    { id: '4', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
    { id: '5', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
    { id: '6', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  ];

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const response = await fetch(API_URL, {
          headers: {
            'x-api-key': API_KEY
          }
        });
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить котиков');
        }
        
        const data = await response.json();
        setCats(data.map((cat: any) => ({
          id: cat.id,
          url: cat.url
        })));
      } catch (err) {
        setError('Ошибка при загрузке данных. Используются моковые данные.');
        console.error('API error:', err);
        setCats(mockCats); // Используем моковые данные при ошибке
      } finally {
        setIsLoading(false);
      }
    };

    fetchCats();
  }, []);

  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [likedCats, setLikedCats] = useState<string[]>([]); // Изменяем тип на string[]

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

  const handleLikeToggle = (catId: string) => { // Изменяем тип параметра на string
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

  if (isLoading) {
    return <div className="loading">Загрузка котиков...</div>;
  }

  if (error) {
    toast.warn(error);
  }

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      
      <div className="cats-container">
        {displayedCats.map(cat => (
          <CatCard 
            key={cat.id} 
            cat={cat} 
            isLiked={likedCats.includes(cat.id)}
            onLikeToggle={handleLikeToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default MainPage;