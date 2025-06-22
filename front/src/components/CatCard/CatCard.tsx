// src/components/CatCard/CatCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CatCard.module.css';
import HeartIcon from '../HeartIcon/HeartIcon';

interface CatCardProps {
  cat: {
    id: number;
    url: string;
  };
  isLiked: boolean;
  onLikeToggle: (id: number) => void;
}

const CatCard: React.FC<CatCardProps> = ({ cat, isLiked, onLikeToggle }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleLikeClick = () => {
    if (!localStorage.getItem('access_token')) {
      navigate('/auth');
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
      <img src={cat.url} alt={`Cat ${cat.id}`} className={styles.catImage} />
      
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