import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CatCard.module.css';
import HeartIcon from '../HeartIcon/HeartIcon';
import { toast } from 'react-toastify';

interface CatCardProps {
  cat: {
    id: string;
    url: string;
  };
  isLiked: boolean;
  onLikeToggle: (id: string) => void;
}

const CatCard: React.FC<CatCardProps> = ({ cat, isLiked, onLikeToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState(cat.url);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();

  // Fallback изображение
  const FALLBACK_IMAGE = 'https://cdn2.thecatapi.com/images/ebv.jpg';

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    
    img.onerror = () => {
      if (retryCount < 3) {
        // Пробуем загрузить еще раз
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          setImageUrl(`${cat.url}?retry=${retryCount}`); // Добавляем параметр чтобы избежать кеша
        }, 1000 * retryCount);
      } else {
        // Используем fallback после 3 неудачных попыток
        setImageUrl(FALLBACK_IMAGE);
      }
    };

    return () => {
      img.onerror = null;
    };
  }, [imageUrl, retryCount, cat.url]);

  const handleLikeClick = () => {
    if (!localStorage.getItem('access_token')) {
      navigate('/auth');
      toast.warn('Для доступа к этой функции необходима авторизация');
      return;
    }
    onLikeToggle(cat.id);
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
          >
            <HeartIcon isLiked={isLiked} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CatCard;