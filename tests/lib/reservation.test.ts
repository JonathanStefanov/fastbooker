import { describe, it, expect, vi } from 'vitest';
import reserve from '@/lib/reservation';

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

import axios from 'axios';

describe('reserve', () => {
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
});
