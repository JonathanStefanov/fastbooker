const STORAGE_KEY = 'fastbooker-favorites';

export function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addFavorite(seatId: string): string[] {
  const favs = getFavorites();
  if (!favs.includes(seatId)) {
    favs.push(seatId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  }
  return favs;
}

export function removeFavorite(seatId: string): string[] {
  const favs = getFavorites().filter(id => id !== seatId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
  return favs;
}

export function toggleFavorite(seatId: string): string[] {
  return isFavorite(seatId) ? removeFavorite(seatId) : addFavorite(seatId);
}

export function isFavorite(seatId: string): boolean {
  return getFavorites().includes(seatId);
}
