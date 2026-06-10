import { describe, it, expect, vi, beforeEach } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
vi.stubGlobal('localStorage', localStorageMock);

import { getFavorites, addFavorite, removeFavorite, toggleFavorite, isFavorite } from '@/lib/favorites';

describe('favorites', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('getFavorites returns [] when empty', () => {
    expect(getFavorites()).toEqual([]);
  });

  it('addFavorite adds a seat', () => {
    const result = addFavorite('seat-1');
    expect(result).toEqual(['seat-1']);
    expect(getFavorites()).toEqual(['seat-1']);
  });

  it('addFavorite does not duplicate', () => {
    addFavorite('seat-1');
    const result = addFavorite('seat-1');
    expect(result).toEqual(['seat-1']);
  });

  it('removeFavorite removes correctly', () => {
    addFavorite('seat-1');
    addFavorite('seat-2');
    const result = removeFavorite('seat-1');
    expect(result).toEqual(['seat-2']);
    expect(getFavorites()).toEqual(['seat-2']);
  });

  it('toggleFavorite adds when not favorited', () => {
    const result = toggleFavorite('seat-1');
    expect(result).toEqual(['seat-1']);
  });

  it('toggleFavorite removes when already favorited', () => {
    addFavorite('seat-1');
    const result = toggleFavorite('seat-1');
    expect(result).toEqual([]);
  });

  it('isFavorite returns correct boolean', () => {
    expect(isFavorite('seat-1')).toBe(false);
    addFavorite('seat-1');
    expect(isFavorite('seat-1')).toBe(true);
  });

  it('SSR safety: getFavorites returns [] when window is undefined', () => {
    // Simulate SSR by making localStorage throw
    localStorageMock.getItem.mockImplementation(() => { throw new Error('not available'); });
    // The function catches the error and returns []
    const origWindow = globalThis.window;
    // @ts-expect-error testing SSR
    delete globalThis.window;
    const result = getFavorites();
    expect(result).toEqual([]);
    globalThis.window = origWindow;
  });
});
