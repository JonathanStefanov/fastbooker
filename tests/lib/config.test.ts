import { describe, it, expect } from 'vitest';
import { AFFLUENCES_RESERVATION_API, AFFLUENCES_SITES_API, AFFLUENCES_ORIGIN } from '@/lib/config';

describe('config', () => {
  it('exports AFFLUENCES_RESERVATION_API', () => {
    expect(AFFLUENCES_RESERVATION_API).toBe('https://reservation.affluences.com/api');
  });

  it('exports AFFLUENCES_SITES_API', () => {
    expect(AFFLUENCES_SITES_API).toBe('https://api.affluences.com/app/v3/sites');
  });

  it('exports AFFLUENCES_ORIGIN', () => {
    expect(AFFLUENCES_ORIGIN).toBe('https://affluences.com');
  });

  it('RESERVATION_API does not end with trailing slash', () => {
    expect(AFFLUENCES_RESERVATION_API).not.toMatch(/\/$/);
  });

  it('SITES_API is a valid URL', () => {
    expect(() => new URL(AFFLUENCES_SITES_API)).not.toThrow();
  });

  it('ORIGIN is a valid URL', () => {
    expect(() => new URL(AFFLUENCES_ORIGIN)).not.toThrow();
  });
});
