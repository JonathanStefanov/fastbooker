import type { Floor } from '@/types';
import { AFFLUENCES_RESERVATION_API, AFFLUENCES_SITES_API, AFFLUENCES_ORIGIN } from './config';

export interface FloorWithSource extends Floor {
  sourceLibraryId?: string;
}

async function fetchTypes(siteId: string): Promise<Floor[]> {
  try {
    const response = await fetch(
      `${AFFLUENCES_RESERVATION_API}/site/${siteId}/types`,
      { next: { revalidate: 3600 } }
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
      {
        headers: {
          'Accept': 'application/json',
          'Origin': AFFLUENCES_ORIGIN,
          'Referer': `${AFFLUENCES_ORIGIN}/`,
        },
        next: { revalidate: 3600 },
      }
    );
    if (!response.ok) return [];
    const data = await response.json();
    const children = data?.children ?? data?.data?.children ?? [];
    return children.map((c: { id: string }) => c.id).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function getFloors(id: string): Promise<FloorWithSource[]> {
  // Fetch floors for the library itself
  const floors = await fetchTypes(id);

  // If the library has floors, return them with the source ID
  if (floors.length > 0) {
    return floors.map((f) => ({ ...f, sourceLibraryId: id }));
  }

  // Otherwise, try to find and fetch children's floors
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
