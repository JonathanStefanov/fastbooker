import { describe, it, expect, vi, beforeEach } from 'vitest';
import reserve from '@/lib/reservation';
import { AFFLUENCES_RESERVATION_API } from '@/lib/config';

vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

import axios from 'axios';

describe('reserve', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns success tuple on successful booking', async () => {
    (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { successMessage: 'Booking confirmed!' },
    });

    const result = await reserve('test@ulb.be', '2026-01-15', '09:00', '10:00', 'seat-123');
    expect(result).toEqual([1, 'Booking confirmed!']);
  });

  it('returns error tuple on failed booking', async () => {
    (axios.post as ReturnType<typeof vi.fn>).mockRejectedValue({
      response: { data: { errorMessage: 'Seat already taken' } },
    });

    const result = await reserve('test@ulb.be', '2026-01-15', '09:00', '10:00', 'seat-123');
    expect(result).toEqual([0, 'Seat already taken']);
  });

  it('handles missing error response gracefully', async () => {
    (axios.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'));

    const result = await reserve('test@ulb.be', '2026-01-15', '09:00', '10:00', 'seat-123');
    expect(result[0]).toBe(0);
    expect(result[1]).toBe('Reservation failed');
  });

  it('posts to AFFLUENCES_RESERVATION_API/reserve/{id}', async () => {
    (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { successMessage: 'ok' },
    });

    await reserve('test@ulb.be', '2026-01-15', '09:00', '10:00', 'seat-999');

    expect(axios.post).toHaveBeenCalledWith(
      `${AFFLUENCES_RESERVATION_API}/reserve/seat-999`,
      expect.any(Object),
      expect.any(Object)
    );
  });

  it('sends correct payload with email, date, times', async () => {
    (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { successMessage: 'ok' },
    });

    await reserve('user@ulb.be', '2026-06-15', '14:00', '16:00', 'seat-1');

    const [url, data] = (axios.post as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('seat-1');
    expect(data.email).toBe('user@ulb.be');
    expect(data.date).toBe('2026-06-15');
    expect(data.start_time).toBe('14:00');
    expect(data.end_time).toBe('16:00');
    expect(data.person_count).toBe(1);
  });

  it('sets correct Content-Type and Accept headers', async () => {
    (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { successMessage: 'ok' },
    });

    await reserve('test@ulb.be', '2026-01-15', '09:00', '10:00', 'seat-1');

    const [, , options] = (axios.post as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(options.headers['Content-Type']).toBe('application/json');
    expect(options.headers['Accept']).toBe('application/json, text/plain, */*');
  });

  it('uses config URL instead of hardcoded URL', async () => {
    (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { successMessage: 'ok' },
    });

    await reserve('test@ulb.be', '2026-01-15', '09:00', '10:00', 'seat-1');

    const url = (axios.post as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(url).toBe(`${AFFLUENCES_RESERVATION_API}/reserve/seat-1`);
    expect(url).not.toContain('reservation.affluences.com/api/reserve');
  });
});
