// src/pages/MainPage/MainPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import CatCard from '../../components/CatCard/CatCard';
import { toast } from 'react-toastify';
import './MainPage.module.css';

interface Cat {
  id: number;
  url: string;
}

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [cats] = useState<Cat[]>([
    { id: 1, url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
    { id: 2, url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
    { id: 3, url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
    { id: 4, url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
    { id: 5, url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
    { id: 6, url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  ]);



  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [likedCats, setLikedCats] = useState<number[]>([]);

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

  const handleLikeToggle = (catId: number) => {
    // Проверяем аутентификацию при лайке
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