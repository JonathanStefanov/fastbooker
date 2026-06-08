import { NextResponse } from 'next/server';
import getLibraries from '@/lib/getLibraries';
import getAllSeats from '@/lib/getAllSeats';

// ISR: cache this route's response for 5 minutes
export const revalidate = 300;

// In-memory cache with TTL (survives across requests within the same process)
const memoryCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = memoryCache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data;
  }
  memoryCache.delete(key);
  return null;
}

function setCache(key, data) {
  memoryCache.set(key, { data, timestamp: Date.now() });
  // Prevent memory leak: cap at 50 entries
  if (memoryCache.size > 50) {
    const oldest = memoryCache.keys().next().value;
    memoryCache.delete(oldest);
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get('university') || 'ulb';
  const cacheKey = `libs:${universityId}`;

  // Check in-memory cache first
  const cached = getCached(cacheKey);
  if (cached) {
    return NextResponse.json(cached, {
      headers: { 'X-Cache': 'HIT', 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  }

  try {
    const libraries = await getLibraries(universityId);

    // Fetch seat counts for all libraries in parallel
    const today = new Date().toISOString().split('T')[0];
    const librariesWithCounts = await Promise.all(
      libraries.map(async (library) => {
        try {
          const seats = await getAllSeats(library.id, today);
          return {
            ...library,
            seatCount: seats ? seats.length : 0,
          };
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
