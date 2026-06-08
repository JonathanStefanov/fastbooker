import { NextResponse } from 'next/server';
import getLibraries from '@/lib/getLibraries';
import getAllSeats from '@/lib/getAllSeats';

export const revalidate = 300;

const memoryCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key: string) {
  const entry = memoryCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  memoryCache.delete(key);
  return null;
}

function setCache(key: string, data: unknown) {
  memoryCache.set(key, { data, timestamp: Date.now() });
  if (memoryCache.size > 50) {
    const oldest = memoryCache.keys().next().value;
    if (oldest) memoryCache.delete(oldest);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get('university') || 'ulb';
  const cacheKey = `libs:${universityId}`;

  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  try {
    const libraries = await getLibraries(universityId);
    const today = new Date().toISOString().split('T')[0];
    const librariesWithCounts = await Promise.all(
      libraries.map(async (library) => {
        try {
          const seats = await getAllSeats(library.id, today);
          return { ...library, seatCount: seats?.length ?? 0 };
        } catch {
          return { ...library, seatCount: 0 };
        }
      })
    );

    setCache(cacheKey, librariesWithCounts);

    return NextResponse.json(librariesWithCounts, {
      headers: { 'X-Cache': 'MISS', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('Error fetching libraries:', error);
    return NextResponse.json({ error: 'Failed to fetch libraries' }, { status: 500 });
  }
}
