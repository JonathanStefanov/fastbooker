import { describe, it, expect, vi, beforeEach } from 'vitest';
import getSeats from '@/lib/getSeats';
import { AFFLUENCES_RESERVATION_API } from '@/lib/config';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getSeats', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('fetches from correct URL with library, date, and id params', async () => {
    const mockSeats = [{ hour: '09:00', places_available: 5, status: 'available' }];
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockSeats),
    });

    await getSeats('lib-123', 'floor-456', '2026-01-15');

    expect(mockFetch).toHaveBeenCalledWith(
      `${AFFLUENCES_RESERVATION_API}/resources/lib-123/available?date=2026-01-15&type=floor-456`,
      { next: { revalidate: 120 } }
    );
  });

  it('returns seat data from API', async () => {
    const mockSeats = [
      { hour: '09:00', places_available: 5, status: 'available' },
      { hour: '09:30', places_available: 0, status: 'unavailable' },
    ];
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve(mockSeats),
    });

    const result = await getSeats('lib-1', 'floor-1', '2026-01-15');
    expect(result).toEqual(mockSeats);
  });

  it('uses AFFLUENCES_RESERVATION_API base URL', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve([]),
    });

    await getSeats('lib', 'floor', '2026-01-01');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain(AFFLUENCES_RESERVATION_API);
    expect(calledUrl).not.toContain('undefined');
  });

  it('passes date as query parameter', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve([]),
    });

    await getSeats('lib', 'floor', '2026-12-31');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('date=2026-12-31');
  });

  it('passes type as floor id', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve([]),
    });

    await getSeats('lib', 'my-floor-id', '2026-01-01');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('type=my-floor-id');
  });
});
