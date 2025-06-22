/* eslint-disable prettier/prettier */
// src/pages/MainPage/MainPage.tsx
import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import CatCard from '../../components/CatCard/CatCard';
import './MainPage.module.css';

interface Cat {
  id: number;
  url: string;
}

const MainPage: React.FC = () => {
  const [cats] = useState<Cat[]>([
    { id: 1, url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
    { id: 2, url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
    { id: 3, url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
    { id: 4, url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
    { id: 5, url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
    { id: 6, url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
    // ... другие коты
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [likedCats, setLikedCats] = useState<number[]>([]);

  const handleLikeToggle = (catId: number) => {
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
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
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