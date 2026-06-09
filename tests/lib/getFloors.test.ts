import { describe, it, expect, vi, beforeEach } from 'vitest';
import getFloors from '@/lib/getFloors';
import { AFFLUENCES_RESERVATION_API } from '@/lib/config';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getFloors', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('fetches from correct URL with library id', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ types: [] }),
    });

    await getFloors('lib-123');

    expect(mockFetch).toHaveBeenCalledWith(
      `${AFFLUENCES_RESERVATION_API}/site/lib-123/types`,
      { next: { revalidate: 3600 } }
    );
  });

  it('returns types array from response', async () => {
    const mockFloors = [
      { resource_type: 'floor-1', localized_description: 'Ground Floor' },
      { resource_type: 'floor-2', localized_description: 'First Floor' },
    ];
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ types: mockFloors }),
    });

    const result = await getFloors('lib-1');
    expect(result).toEqual(mockFloors);
  });

  it('uses AFFLUENCES_RESERVATION_API base URL', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ types: [] }),
    });

    await getFloors('my-lib');

    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain(AFFLUENCES_RESERVATION_API);
    expect(calledUrl).toContain('/site/my-lib/types');
  });

  it('uses 1 hour revalidation', async () => {
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ types: [] }),
    });

    await getFloors('lib');

    const options = mockFetch.mock.calls[0][1];
    expect(options.next.revalidate).toBe(3600);
  });
});
