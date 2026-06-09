import { describe, it, expect, vi, beforeEach } from 'vitest';
import getLibraries from '@/lib/getLibraries';
import { AFFLUENCES_SITES_API, AFFLUENCES_ORIGIN } from '@/lib/config';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('getLibraries', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('fetches from AFFLUENCES_SITES_API', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: { results: [], next: false, total: 0 },
      }),
    });

    await getLibraries('ulb');

    expect(mockFetch).toHaveBeenCalledWith(
      AFFLUENCES_SITES_API,
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('sends correct headers including Origin and Referer', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: { results: [], next: false, total: 0 },
      }),
    });

    await getLibraries('ulb');

    const options = mockFetch.mock.calls[0][1];
    expect(options.headers['Origin']).toBe(AFFLUENCES_ORIGIN);
    expect(options.headers['Referer']).toBe(`${AFFLUENCES_ORIGIN}/`);
  });

  it('sends university search query in body', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: { results: [], next: false, total: 0 },
      }),
    });

    await getLibraries('ulb');

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.search_query).toBe('ulb');
  });

  it('returns filtered libraries with id and primary_name', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          results: [
            { id: '1', primary_name: 'Library A', slug: 'lib-a', booking_available: true },
            { id: '2', primary_name: 'Library B', slug: 'lib-b', booking_available: true },
            { id: null, primary_name: null }, // should be filtered out
          ],
          next: false,
          total: 3,
        },
      }),
    });

    const result = await getLibraries('ulb');
    expect(result).toHaveLength(2);
    expect(result[0].primary_name).toBe('Library A');
  });

  it('applies library overrides from university config', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: {
          results: [
            { id: '1', primary_name: 'BSS', slug: 'ulb-bss', booking_available: false },
          ],
          next: false,
          total: 1,
        },
      }),
    });

    const result = await getLibraries('ulb');
    // ulb-bss has forceBookingAvailable: true in universities.ts
    expect(result[0].booking_available).toBe(true);
  });

  it('defaults to ULB when no university specified', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: { results: [], next: false, total: 0 },
      }),
    });

    await getLibraries();

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.search_query).toBe('ulb');
  });

  it('paginates when next is true', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            results: [{ id: '1', primary_name: 'A', slug: 'a' }],
            next: true,
            total: 2,
            max_size: 1,
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          data: {
            results: [{ id: '2', primary_name: 'B', slug: 'b' }],
            next: false,
            total: 2,
            max_size: 1,
          },
        }),
      });

    const result = await getLibraries('ulb');
    expect(result).toHaveLength(2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it('handles API error gracefully', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await getLibraries('ulb');
    expect(result).toEqual([]);
  });
});
