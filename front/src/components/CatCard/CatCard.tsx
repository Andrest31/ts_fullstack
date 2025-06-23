import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CatCard.module.css';
import HeartIcon from '../HeartIcon/HeartIcon';
import { toast } from 'react-toastify';
import axios from 'axios';

interface CatCardProps {
  cat: {
    id: string;
    url: string;
  };
  isLiked: boolean;
  onLikeToggle: (id: string) => void;
}

const API_URL = 'http://localhost:3000/api/likes'; // Замените на ваш реальный URL

const CatCard: React.FC<CatCardProps> = ({ cat, isLiked, onLikeToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState(cat.url);
  const [retryCount, setRetryCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const FALLBACK_IMAGE = 'https://cdn2.thecatapi.com/images/ebv.jpg';

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    
    img.onerror = () => {
      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setImageUrl(`${cat.url}?retry=${retryCount}`);
        }, 1000 * retryCount);
      } else {
        setImageUrl(FALLBACK_IMAGE);
      }
    };

    return () => {
      img.onerror = null;
    };
  }, [imageUrl, retryCount, cat.url]);

  const handleLikeClick = async () => {
    if (!localStorage.getItem('access_token')) {
      navigate('/auth');
      toast.warn('Для доступа к этой функции необходима авторизация');
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('access_token');
      
      if (isLiked) {
        // Удаляем лайк
        await axios.delete(`${API_URL}/${cat.id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Добавляем лайк
        await axios.post(API_URL, { cat_id: cat.id }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      onLikeToggle(cat.id); // Обновляем UI
    } catch (error) {
      console.error('Error processing like:', error);
      toast.error('Произошла ошибка при обработке лайка');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      className={styles.catCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={imageUrl} 
        alt={`Cat ${cat.id}`} 
        className={styles.catImage}
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
        }}
      />
      
      {isHovered && (
        <div className={styles.hoverOverlay}>
          <button 
            className={styles.likeButton}
            onClick={handleLikeClick}
            disabled={isProcessing}
          >
            <HeartIcon isLiked={isLiked} />
            {isProcessing && <span className={styles.spinner}></span>}
          </button>
        </div>
      )}
    </div>
  );
};

export default CatCard;