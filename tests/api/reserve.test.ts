import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '@/app/api/reserve/route';

// Mock the config module
vi.mock('@/lib/config', () => ({
  AFFLUENCES_RESERVATION_API: 'https://reservation.affluences.com/api',
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeRequest(body: Record<string, string>) {
  return new Request('http://localhost:3000/api/reserve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('/api/reserve POST', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 when required fields are missing', async () => {
    const req = makeRequest({ email: 'test@ulb.be' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain('Missing required fields');
  });

  it('proxies to Affluences API with correct URL and headers', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ successMessage: 'Booked!' }),
    });

    const req = makeRequest({
      seatId: '10102',
      email: 'test@ulb.be',
      date: '2026-06-10',
      start_time: '14:00',
      end_time: '14:30',
    });
    await POST(req);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('https://reservation.affluences.com/api/reserve/10102');
    expect(options.method).toBe('POST');
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.headers['User-Agent']).toContain('Mozilla');
  });

  it('sends correct payload to Affluences API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ successMessage: 'ok' }),
    });

    const req = makeRequest({
      seatId: '10102',
      email: 'yo@ulb.be',
      date: '2026-06-10',
      start_time: '21:30',
      end_time: '22:00',
    });
    await POST(req);

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.email).toBe('yo@ulb.be');
    expect(body.date).toBe('2026-06-10');
    expect(body.start_time).toBe('21:30');
    expect(body.end_time).toBe('22:00');
    expect(body.person_count).toBe(1);
  });

  it('returns success response from Affluences API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ successMessage: 'Booking confirmed!' }),
    });

    const req = makeRequest({
      seatId: '10102',
      email: 'test@ulb.be',
      date: '2026-06-10',
      start_time: '14:00',
      end_time: '14:30',
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.successMessage).toBe('Booking confirmed!');
  });

  it('returns error when Affluences API fails', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ errorMessage: 'Seat already taken' }),
    });

    const req = makeRequest({
      seatId: '10102',
      email: 'test@ulb.be',
      date: '2026-06-10',
      start_time: '14:00',
      end_time: '14:30',
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Seat already taken');
  });

  it('handles network errors gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const req = makeRequest({
      seatId: '10102',
      email: 'test@ulb.be',
      date: '2026-06-10',
      start_time: '14:00',
      end_time: '14:30',
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Reservation failed');
  });
});
