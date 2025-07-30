'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { favoritesAPI } from '@/services/api';

interface FavoriteButtonProps {
  blogId: number;
  isFavorited?: boolean;
  onToggle?: (isFavorited: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function FavoriteButton({ 
  blogId, 
  isFavorited = false, 
  onToggle, 
  size = 'md',
  showText = false 
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation if button is inside a link
    e.stopPropagation();

    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    try {
      if (favorited) {
        await favoritesAPI.removeFromFavorites(blogId);
        setFavorited(false);
        onToggle?.(false);
      } else {
        await favoritesAPI.addToFavorites(blogId);
        setFavorited(true);
        onToggle?.(true);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert state on error
      setFavorited(!favorited);
    } finally {
      setLoading(false);
    }
  };

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`
        ${buttonSizeClasses[size]}
        ${favorited 
          ? 'text-red-600 hover:text-red-800 hover:bg-red-50' 
          : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
        }
        rounded-lg transition-all duration-200 disabled:opacity-50
        ${showText ? 'flex items-center space-x-1' : ''}
      `}
      title={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-b-2 border-current ${sizeClasses[size]}`}></div>
      ) : (
        <>
          <Heart 
            className={`${sizeClasses[size]} ${favorited ? 'fill-current' : ''} transition-all duration-200`} 
          />
          {showText && (
            <span className={`font-medium ${textSizeClasses[size]}`}>
              {favorited ? 'Favorited' : 'Favorite'}
            </span>
          )}
        </>
      )}
    </button>
  );
}