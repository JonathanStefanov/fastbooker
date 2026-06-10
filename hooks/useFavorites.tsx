'use client';
import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getFavorites, toggleFavorite as toggle, isFavorite as isFav } from '@/lib/favorites';

interface FavoritesContextValue {
  favorites: string[];
  toggleFavorite: (seatId: string) => void;
  isFavorite: (seatId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
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

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
