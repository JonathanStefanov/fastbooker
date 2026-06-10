import { NextResponse } from 'next/server';
import { AFFLUENCES_RESERVATION_API } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { seatId, email, date, start_time, end_time } = body;

    if (!seatId || !email || !date || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Missing required fields: seatId, email, date, start_time, end_time' },
        { status: 400 }
      );
    }

    const url = `${AFFLUENCES_RESERVATION_API}/reserve/${seatId}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Origin': 'https://affluences.com',
      'Referer': 'https://affluences.com/',
    };

    const data = {
      auth_type: null,
      email,
      date,
      start_time,
      end_time,
      note: null,
      user_firstname: null,
      user_lastname: null,
      user_phone: null,
      person_count: 1,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: result.errorMessage || 'Reservation failed' },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json({ error: 'Reservation failed' }, { status: 500 });
  }
}
