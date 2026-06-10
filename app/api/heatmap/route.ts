import { NextResponse } from 'next/server';
import getAllSeats from '@/lib/getAllSeats';

export const revalidate = 300;

export interface HeatmapSlot {
  hour: string;
  available: number;
  total: number;
}

export interface HeatmapDay {
  date: string;
  dayName: string;
  slots: HeatmapSlot[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libraryId = searchParams.get('library');

  if (!libraryId) {
    return NextResponse.json({ error: 'Missing required param: library' }, { status: 400 });
  }

  try {
    const today = new Date();
    const days: Promise<HeatmapDay>[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

      days.push(
        (async () => {
          try {
            const seats = await getAllSeats(libraryId, dateStr);
            const slotMap = new Map<string, { available: number; total: number }>();

            for (const seat of seats) {
              for (const hour of seat.hours ?? []) {
                const existing = slotMap.get(hour.hour) ?? { available: 0, total: 0 };
                existing.total++;
                if (hour.places_available > 0) existing.available++;
                slotMap.set(hour.hour, existing);
              }
            }

            const slots = Array.from(slotMap.entries())
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([hour, data]) => ({ hour, ...data }));

            return { date: dateStr, dayName, slots };
          } catch {
            return { date: dateStr, dayName, slots: [] };
          }
        })()
      );
    }

    const results = await Promise.all(days);
    return NextResponse.json(results, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    return NextResponse.json({ error: 'Failed to fetch heatmap data' }, { status: 500 });
  }
}
