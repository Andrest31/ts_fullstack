// src/pages/MainPage/MainPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import CatCard from '../../components/CatCard/CatCard';
import Pagination from '../../components/Pagination/Pagination';
import { toast } from 'react-toastify';
import './MainPage.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Cat {
  id: string;
  url: string;
}

const API_KEY = 'live_R5T2LCdpNrp1EaqRr73CNAS5YB0NuXcG2KY1Busj16g2kdMfTh1Mt92BknObWyW8';
const BASE_API_URL = 'https://api.thecatapi.com/v1/images/search';
const LOAD_TIMEOUT = 15000;
const CATS_PER_PAGE = 15;

// Скелетон для карточки кота
const CatCardSkeleton: React.FC = () => (
  <div className="cat-card-skeleton">
    <div className="skeleton-image"></div>
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
  { id: '1', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '2', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '3', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '4', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '5', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '6', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '1', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '2', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '3', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '4', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '5', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '6', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '1', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '2', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '3', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '4', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '5', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '6', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '1', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '2', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '3', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '4', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '5', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '6', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '1', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '2', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '3', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '4', url: 'https://avatars.mds.yandex.net/i?id=88c1bc5c684c9a8e76a771015283e4e7_l-5240374-images-thumbs&n=13' },
  { id: '5', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
  { id: '6', url: 'https://cs11.pikabu.ru/post_img/2018/12/20/0/og_og_1545256348238056552.jpg' },
];

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const [allCats, setAllCats] = useState<Cat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
  const [likedCats, setLikedCats] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setTotalPages] = useState(1);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Получаем список всех котов
  useEffect(() => {
    const fetchCats = async () => {
      setIsLoading(true);
      setError(null);
      
      // Устанавливаем таймаут
      timeoutRef.current = setTimeout(() => {
        setError('Превышено время ожидания загрузки. Временно используются моковые данные.');
        setAllCats(mockCats);
        setTotalPages(Math.ceil(mockCats.length / CATS_PER_PAGE));
        setIsLoading(false);
      }, LOAD_TIMEOUT);

      try {
        const controller = new AbortController();
        const signal = controller.signal;
        
        // Загружаем больше котов, чем нужно, чтобы избежать частых запросов
        const response = await fetch(`${BASE_API_URL}?limit=300&size=small`, {
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
        
        const loadedCats = data.map((cat: any) => ({
          id: cat.id,
          url: cat.url
        }));
        
        setAllCats(loadedCats);
        setTotalPages(Math.ceil(loadedCats.length / CATS_PER_PAGE));
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError('Ошибка при загрузке данных. Используются моковые данные.');
          console.error('API error:', err);
          setAllCats(mockCats);
          setTotalPages(Math.ceil(mockCats.length / CATS_PER_PAGE));
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
      if (!Cookies.get('access_token')) return;
      
      try {
        const response = await axios.get('http://localhost:3000/api/likes', {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`
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
    if (activeTab === 'favorites' && !Cookies.get('access_token')) {
      navigate('/auth');
    }
  }, [activeTab, navigate]);

  const handleTabChange = (tab: 'all' | 'favorites') => {
    if (tab === 'favorites' && !Cookies.get('access_token')) {
      navigate('/auth');
      toast.warn('Для доступа к этой функции необходима авторизация');
      return;
    }
    setActiveTab(tab);
    setCurrentPage(1); // Сбрасываем на первую страницу при смене вкладки
  };

  const handleLikeToggle = (catId: string) => {
    if (!Cookies.get('access_token')) {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Фильтруем котов по активной вкладке
  const filteredCats = activeTab === 'all' 
    ? allCats 
    : allCats.filter(cat => likedCats.includes(cat.id));

  // Вычисляем общее количество страниц для отфильтрованных котов
  const displayedTotalPages = Math.ceil(filteredCats.length / CATS_PER_PAGE) || 1;

  // Получаем котов для текущей страницы
  const paginatedCats = filteredCats.slice(
    (currentPage - 1) * CATS_PER_PAGE,
    currentPage * CATS_PER_PAGE
  );

  // Стили для скелетонов
  const styles = `
    .cat-card-skeleton {
      background: #f0f0f0;
      border-radius: 8px;
      overflow: hidden;
      height: 223px;
      width: 223px;
      position: relative;
    }
    
    .skeleton-image {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0, #e0e0e0, #f0f0f0);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
    }
    
    .no-cats-message {
      width: 100%;
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px;
      font-size: 18px;
      color: #666;
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
          Array.from({ length: CATS_PER_PAGE }).map((_, index) => (
            <CatCardSkeleton key={`skeleton-${index}`} />
          ))
        ) : paginatedCats.length > 0 ? (
          // Показываем карточки с котами
          paginatedCats.map(cat => (
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
      
      {!isLoading && filteredCats.length > CATS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={displayedTotalPages}
          onPageChange={handlePageChange}
        />
      )}
      
      {error && toast.warn(error)}
    </div>
  );
};

export default MainPage;