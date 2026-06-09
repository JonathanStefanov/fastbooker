import type { Floor } from '@/types';
import { AFFLUENCES_RESERVATION_API, AFFLUENCES_SITES_API, AFFLUENCES_ORIGIN } from './config';

export interface FloorWithSource extends Floor {
  sourceLibraryId?: string;
}

const HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'fr',
  'Origin': AFFLUENCES_ORIGIN,
  'Referer': `${AFFLUENCES_ORIGIN}/`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
};

async function fetchTypes(siteId: string): Promise<Floor[]> {
  try {
    const response = await fetch(
      `${AFFLUENCES_RESERVATION_API}/site/${siteId}/types`,
      { headers: HEADERS, next: { revalidate: 3600 } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    return data.types ?? [];
  } catch {
    return [];
  }
}

async function fetchChildren(siteId: string): Promise<string[]> {
  try {
    const response = await fetch(
      `${AFFLUENCES_SITES_API}/${siteId}`,
      { headers: HEADERS, next: { revalidate: 3600 } }
    );
    if (!response.ok) return [];
    const data = await response.json();
    const inner = data?.data ?? data;
    const children = inner?.children ?? [];
    return children.map((c: { id: string }) => c.id).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function getFloors(id: string): Promise<FloorWithSource[]> {
  const floors = await fetchTypes(id);
  if (floors.length > 0) {
    return floors.map((f) => ({ ...f, sourceLibraryId: id }));
  }

  const childIds = await fetchChildren(id);
  if (childIds.length === 0) return [];

  const childFloors = await Promise.all(
    childIds.map(async (childId) => {
      const types = await fetchTypes(childId);
      return types.map((t) => ({ ...t, sourceLibraryId: childId }));
    })
  );

  return childFloors.flat();
}
