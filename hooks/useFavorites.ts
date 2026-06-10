'use client';
import { useState, useCallback, useEffect } from 'react';
import { getFavorites, toggleFavorite as toggle, isFavorite as isFav } from '@/lib/favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const toggleFavorite = useCallback((seatId: string) => {
    setFavorites(toggle(seatId));
  }, []);

  const isFavorite = useCallback((seatId: string) => {
    return favorites.includes(seatId);
  }, [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
