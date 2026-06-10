import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import getFloors from '@/lib/getFloors';
import { AFFLUENCES_RESERVATION_API } from '@/lib/config';

describe('getFloors', () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      json: () => Promise.resolve({ types: [] }),
    } as Response);
  });

  afterEach(() => {
    fetchSpy.mockRestore();
  });

  it('fetches from correct URL with library id', async () => {
    await getFloors('lib-123');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      `${AFFLUENCES_RESERVATION_API}/site/lib-123/types`,
      { next: { revalidate: 3600 } }
    );
  });

  it('returns types array from response', async () => {
    const mockFloors = [
      { resource_type: 'floor-1', localized_description: 'Ground Floor' },
      { resource_type: 'floor-2', localized_description: 'First Floor' },
    ];
    fetchSpy.mockResolvedValue({
      json: () => Promise.resolve({ types: mockFloors }),
    } as Response);

    const result = await getFloors('lib-1');
    expect(result).toEqual(mockFloors);
  });

  it('uses AFFLUENCES_RESERVATION_API base URL', async () => {
    await getFloors('my-lib');

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain(AFFLUENCES_RESERVATION_API);
    expect(calledUrl).toContain('/site/my-lib/types');
  });

  it('uses 1 hour revalidation', async () => {
    await getFloors('lib');

    const options = fetchSpy.mock.calls[0][1];
    expect(options.next.revalidate).toBe(3600);
  });
});
