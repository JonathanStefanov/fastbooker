import { NextResponse } from 'next/server';
import { AFFLUENCES_SITES_API, AFFLUENCES_ORIGIN } from '@/lib/config';

export const revalidate = 120;

const HEADERS = {
  'Accept': 'application/json, text/plain, */*',
  'Accept-Language': 'fr',
  'Origin': AFFLUENCES_ORIGIN,
  'Referer': `${AFFLUENCES_ORIGIN}/`,
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
};

export interface OccupancyForecast {
  hour: string;
  occupancy: number;
  opened: boolean;
}

export interface OccupancyBuilding {
  id: string;
  name: string;
  occupancy: number | null;
  opened: boolean;
}

export interface OccupancyData {
  currentOccupancy: number | null;
  currentOpened: boolean;
  forecasts: OccupancyForecast[];
  buildings: OccupancyBuilding[];
  siteName: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const libraryId = searchParams.get('library');

  if (!libraryId) {
    return NextResponse.json({ error: 'Missing required param: library' }, { status: 400 });
  }

  try {
    const response = await fetch(`${AFFLUENCES_SITES_API}/${libraryId}`, {
      headers: HEADERS,
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Library not found' }, { status: 404 });
    }

    const json = await response.json();
    const site = json?.data ?? json;

    const current = site?.current_forecast;
    const forecasts: OccupancyForecast[] = (site?.today_forecasts ?? []).map(
      (f: { hour: string; forecast: { opened: boolean; occupancy: number | null } }) => ({
        hour: f.hour,
        occupancy: f.forecast.occupancy,
        opened: f.forecast.opened,
      })
    );

    const buildings: OccupancyBuilding[] = (site?.children ?? []).map(
      (c: { id: string; primary_name: string; current_forecast?: { occupancy: number | null; opened: boolean } }) => ({
        id: c.id,
        name: c.primary_name,
        occupancy: c.current_forecast?.occupancy ?? null,
        opened: c.current_forecast?.opened ?? false,
      })
    );

    const data: OccupancyData = {
      currentOccupancy: current?.occupancy ?? null,
      currentOpened: current?.opened ?? false,
      forecasts,
      buildings,
      siteName: site?.primary_name ?? '',
    };

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=240' },
    });
  } catch (error) {
    console.error('Error fetching occupancy:', error);
    return NextResponse.json({ error: 'Failed to fetch occupancy data' }, { status: 500 });
  }
}
