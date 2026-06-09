import { NextResponse } from 'next/server';
import getAllSeats from '@/lib/getAllSeats';

export const revalidate = 120;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libraryId = searchParams.get('library');
  const date = searchParams.get('date');

  if (!libraryId || !date) {
    return NextResponse.json({ error: 'Missing required params: library, date' }, { status: 400 });
  }

  try {
    const seats = await getAllSeats(libraryId, date);
    return NextResponse.json(seats, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240' },
    });
  } catch (error) {
    console.error('Error fetching all seats:', error);
    return NextResponse.json({ error: 'Failed to fetch seats' }, { status: 500 });
  }
}
