import { NextResponse } from 'next/server';
import getSeats from '@/lib/getSeats';

export const revalidate = 120;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libraryId = searchParams.get('library');
  const floorId = searchParams.get('floor');
  const date = searchParams.get('date');

  if (!libraryId || !floorId || !date) {
    return NextResponse.json({ error: 'Missing required params: library, floor, date' }, { status: 400 });
  }

  try {
    const seats = await getSeats(libraryId, floorId, date);
    return NextResponse.json(seats, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240' },
    });
  } catch (error) {
    console.error('Error fetching seats:', error);
    return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 });
  }
}
