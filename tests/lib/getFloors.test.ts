import { describe, it, expect, vi, beforeEach } from 'vitest';
import getFloors from '@/lib/getFloors';
import { AFFLUENCES_RESERVATION_API } from '@/lib/config';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getFloors', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ types: [] }),
    });
  });

  it('fetches from correct URL with library id', async () => {
    await getFloors('lib-123');

    const reservationCalls = mockFetch.mock.calls.filter(
      (call: unknown[]) => typeof call[0] === 'string' && (call[0] as string).includes('reservation.affluences.com')
    );
    expect(reservationCalls.length).toBeGreaterThanOrEqual(1);
    expect(reservationCalls[0][0]).toBe(`${AFFLUENCES_RESERVATION_API}/site/lib-123/types`);
    expect(reservationCalls[0][1].next.revalidate).toBe(3600);
  });

  it('returns types array from response', async () => {
    const mockFloors = [
      { resource_type: 'floor-1', localized_description: 'Ground Floor' },
      { resource_type: 'floor-2', localized_description: 'First Floor' },
    ];
    mockFetch.mockReset();
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('reservation.affluences.com')) {
        return Promise.resolve({
          json: () => Promise.resolve({ types: mockFloors }),
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve({}),
      });
    });

    const result = await getFloors('lib-1');
    expect(result).toEqual(mockFloors);
  });

  it('uses AFFLUENCES_RESERVATION_API base URL', async () => {
    await getFloors('my-lib');

    const reservationCalls = mockFetch.mock.calls.filter(
      (call: unknown[]) => typeof call[0] === 'string' && (call[0] as string).includes('reservation.affluences.com')
    );
    expect(reservationCalls.length).toBeGreaterThanOrEqual(1);
    const calledUrl = reservationCalls[0][0] as string;
    expect(calledUrl).toContain(AFFLUENCES_RESERVATION_API);
    expect(calledUrl).toContain('/site/my-lib/types');
  });

  it('uses 1 hour revalidation', async () => {
    await getFloors('lib');

    const reservationCalls = mockFetch.mock.calls.filter(
      (call: unknown[]) => typeof call[0] === 'string' && (call[0] as string).includes('reservation.affluences.com')
    );
    expect(reservationCalls.length).toBeGreaterThanOrEqual(1);
    const options = reservationCalls[0][1];
    expect(options.next.revalidate).toBe(3600);
  });
});
