import { describe, it, expect, vi, beforeEach } from 'vitest';
import getAllSeats from '@/lib/getAllSeats';

vi.mock('@/lib/getFloors', () => ({
  default: vi.fn(),
}));

vi.mock('@/lib/getSeats', () => ({
  default: vi.fn(),
}));

import getFloors from '@/lib/getFloors';
import getSeats from '@/lib/getSeats';

describe('getAllSeats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches seats for each floor and merges floor info', async () => {
    (getFloors as ReturnType<typeof vi.fn>).mockResolvedValue([
      { resource_type: 'floor-1', localized_description: 'Ground Floor' },
      { resource_type: 'floor-2', localized_description: 'First Floor' },
    ]);

    (getSeats as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce([
        { resource_id: 'seat-1', resource_name: 'A.001', hours: [] },
      ])
      .mockResolvedValueOnce([
        { resource_id: 'seat-2', resource_name: 'B.001', hours: [] },
      ]);

    const result = await getAllSeats('lib-1', '2026-01-15');

    expect(getFloors).toHaveBeenCalledWith('lib-1');
    expect(getSeats).toHaveBeenCalledTimes(2);
    expect(getSeats).toHaveBeenCalledWith('lib-1', 'floor-1', '2026-01-15');
    expect(getSeats).toHaveBeenCalledWith('lib-1', 'floor-2', '2026-01-15');
    expect(result).toHaveLength(2);
  });

  it('adds floor_name and floor_id to each seat', async () => {
    (getFloors as ReturnType<typeof vi.fn>).mockResolvedValue([
      { resource_type: 'floor-1', localized_description: 'Ground Floor' },
    ]);

    (getSeats as ReturnType<typeof vi.fn>).mockResolvedValue([
      { resource_id: 'seat-1', resource_name: 'A.001', hours: [] },
    ]);

    const result = await getAllSeats('lib-1', '2026-01-15');

    expect(result[0].floor_name).toBe('Ground Floor');
    expect(result[0].floor_id).toBe('floor-1');
  });

  it('flattens seats from multiple floors', async () => {
    (getFloors as ReturnType<typeof vi.fn>).mockResolvedValue([
      { resource_type: 'f1', localized_description: 'Floor 1' },
      { resource_type: 'f2', localized_description: 'Floor 2' },
    ]);

    (getSeats as ReturnType<typeof vi.fn>)
      .mockResolvedValueOnce([
        { resource_id: 's1', resource_name: 'A1', hours: [] },
        { resource_id: 's2', resource_name: 'A2', hours: [] },
      ])
      .mockResolvedValueOnce([
        { resource_id: 's3', resource_name: 'B1', hours: [] },
      ]);

    const result = await getAllSeats('lib-1', '2026-01-15');
    expect(result).toHaveLength(3);
  });

  it('returns empty array when no floors', async () => {
    (getFloors as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const result = await getAllSeats('lib-1', '2026-01-15');
    expect(result).toEqual([]);
  });
});
