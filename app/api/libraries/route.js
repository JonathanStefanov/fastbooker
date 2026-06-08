import { NextResponse } from 'next/server';
import getLibraries from '@/lib/getLibraries';
import getAllSeats from '@/lib/getAllSeats';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const universityId = searchParams.get('university') || 'ulb';

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

    return NextResponse.json(librariesWithCounts);
  } catch (error) {
    console.error('Error fetching libraries:', error);
    return NextResponse.json({ error: 'Failed to fetch libraries' }, { status: 500 });
  }
}
