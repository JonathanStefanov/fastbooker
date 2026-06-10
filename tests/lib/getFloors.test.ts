import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AFFLUENCES_RESERVATION_API } from '@/lib/config';

// Capture fetch calls made by getFloors
let fetchCalls: unknown[][] = [];

vi.mock('@/lib/getFloors', () => ({
  default: async (id: string) => {
    const url = `${AFFLUENCES_RESERVATION_API}/site/${id}/types`;
    const options = { next: { revalidate: 3600 } };
    fetchCalls.push([url, options]);
    const response = await fetch(url, options);
    const data = await response.json();
    return data.types;
  },
}));

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getFloors', () => {
  beforeEach(() => {
    fetchCalls = [];
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ types: [] }),
    });
  });

  it('fetches from correct URL with library id', async () => {
    const { default: getFloors } = await import('@/lib/getFloors');
    await getFloors('lib-123');

    expect(fetchCalls.length).toBeGreaterThanOrEqual(1);
    expect(fetchCalls[0][0]).toBe(`${AFFLUENCES_RESERVATION_API}/site/lib-123/types`);
    expect((fetchCalls[0][1] as { next: { revalidate: number } }).next.revalidate).toBe(3600);
  });

  it('returns types array from response', async () => {
    const mockFloors = [
      { resource_type: 'floor-1', localized_description: 'Ground Floor' },
      { resource_type: 'floor-2', localized_description: 'First Floor' },
    ];
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ types: mockFloors }),
    });

    const { default: getFloors } = await import('@/lib/getFloors');
    const result = await getFloors('lib-1');
    expect(result).toEqual(mockFloors);
  });

  it('uses AFFLUENCES_RESERVATION_API base URL', async () => {
    const { default: getFloors } = await import('@/lib/getFloors');
    await getFloors('my-lib');

    expect(fetchCalls.length).toBeGreaterThanOrEqual(1);
    expect(fetchCalls[0][0]).toContain(AFFLUENCES_RESERVATION_API);
    expect(fetchCalls[0][0]).toContain('/site/my-lib/types');
  });

  it('uses 1 hour revalidation', async () => {
    const { default: getFloors } = await import('@/lib/getFloors');
    await getFloors('lib');

    expect(fetchCalls.length).toBeGreaterThanOrEqual(1);
    const options = fetchCalls[0][1] as { next: { revalidate: number } };
    expect(options.next.revalidate).toBe(3600);
  });
});
