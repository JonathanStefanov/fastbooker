import { describe, it, expect, vi, beforeEach } from 'vitest';
import getLibrarySeatCount from '@/lib/getLibrarySeatCount';

vi.mock('@/lib/getAllSeats', () => ({
  default: vi.fn(),
}));

import getAllSeats from '@/lib/getAllSeats';

describe('getLibrarySeatCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns total seat count', async () => {
    (getAllSeats as ReturnType<typeof vi.fn>).mockResolvedValue([
      { resource_id: 's1', resource_name: 'A1', hours: [] },
      { resource_id: 's2', resource_name: 'A2', hours: [] },
      { resource_id: 's3', resource_name: 'A3', hours: [] },
    ]);

    const count = await getLibrarySeatCount('lib-1');
    expect(count).toBe(3);
  });

  it('returns 0 when no seats', async () => {
    (getAllSeats as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const count = await getLibrarySeatCount('lib-1');
    expect(count).toBe(0);
  });

  it('returns 0 on error', async () => {
    (getAllSeats as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API error'));

    const count = await getLibrarySeatCount('lib-1');
    expect(count).toBe(0);
  });

  it('passes library id to getAllSeats', async () => {
    (getAllSeats as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await getLibrarySeatCount('my-lib-id');

    expect(getAllSeats).toHaveBeenCalledWith('my-lib-id', expect.any(String));
  });

  it('uses today date in YYYY-MM-DD format', async () => {
    (getAllSeats as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    await getLibrarySeatCount('lib-1');

    const calledDate = (getAllSeats as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(calledDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
