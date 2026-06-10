import { describe, it, expect, vi, beforeEach } from 'vitest';
import reserve from '@/lib/reservation';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('reserve', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success tuple on successful booking', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ successMessage: 'Booking confirmed!' }),
    });

    const result = await reserve('test@ulb.be', '2026-01-15', '09:00', '10:00', 'seat-123');
    expect(result).toEqual([1, 'Booking confirmed!']);
  });

  it('returns error tuple on failed booking', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Seat already taken' }),
    });

    const result = await reserve('test@ulb.be', '2026-01-15', '09:00', '10:00', 'seat-123');
    expect(result).toEqual([0, 'Seat already taken']);
  });

  it('handles network error gracefully', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'));

    const result = await reserve('test@ulb.be', '2026-01-15', '09:00', '10:00', 'seat-123');
    expect(result[0]).toBe(0);
    expect(result[1]).toBe('Reservation failed');
  });

  it('posts to /api/reserve with correct body', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ successMessage: 'ok' }),
    });

    await reserve('test@ulb.be', '2026-01-15', '09:00', '10:00', 'seat-999');

    expect(mockFetch).toHaveBeenCalledWith('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seatId: 'seat-999',
        email: 'test@ulb.be',
        date: '2026-01-15',
        start_time: '09:00',
        end_time: '10:00',
      }),
    });
  });

  it('sends correct payload with email, date, times', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ successMessage: 'ok' }),
    });

    await reserve('user@ulb.be', '2026-06-15', '14:00', '16:00', 'seat-1');

    const [, options] = mockFetch.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.email).toBe('user@ulb.be');
    expect(body.date).toBe('2026-06-15');
    expect(body.start_time).toBe('14:00');
    expect(body.end_time).toBe('16:00');
    expect(body.seatId).toBe('seat-1');
  });
});
