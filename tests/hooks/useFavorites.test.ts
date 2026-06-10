import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { type ReactNode } from 'react';

// Mock the favorites lib
vi.mock('@/lib/favorites', () => {
  let store: string[] = [];
  return {
    getFavorites: vi.fn(() => [...store]),
    toggleFavorite: vi.fn((seatId: string) => {
      if (store.includes(seatId)) {
        store = store.filter(id => id !== seatId);
      } else {
        store.push(seatId);
      }
      return [...store];
    }),
    isFavorite: vi.fn((seatId: string) => store.includes(seatId)),
  };
});

import { useFavorites, FavoritesProvider } from '@/hooks/useFavorites';

const wrapper = ({ children }: { children: ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

describe('useFavorites', () => {
  beforeEach(async () => {
    const mod = await import('@/lib/favorites');
    const favs = mod.getFavorites();
    for (const f of favs) {
      mod.toggleFavorite(f);
    }
    vi.clearAllMocks();
  });

  it('initializes with empty favorites', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.favorites).toEqual([]);
  });

  it('toggleFavorite updates state', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => {
      result.current.toggleFavorite('seat-1');
    });
    expect(result.current.favorites).toEqual(['seat-1']);
  });

  it('isFavorite reflects toggled state', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.isFavorite('seat-1')).toBe(false);
    act(() => {
      result.current.toggleFavorite('seat-1');
    });
    expect(result.current.isFavorite('seat-1')).toBe(true);
    act(() => {
      result.current.toggleFavorite('seat-1');
    });
    expect(result.current.isFavorite('seat-1')).toBe(false);
  });

  it('shared context: multiple hook consumers see the same favorites', () => {
    const { result: r1 } = renderHook(() => useFavorites(), { wrapper });
    const { result: r2 } = renderHook(() => useFavorites(), { wrapper });

    act(() => {
      r1.current.toggleFavorite('seat-42');
    });

    expect(r1.current.isFavorite('seat-42')).toBe(true);
    expect(r2.current.isFavorite('seat-42')).toBe(true);
  });
});
