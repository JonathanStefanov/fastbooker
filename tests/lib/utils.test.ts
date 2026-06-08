import { describe, it, expect } from 'vitest';
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('formats a date as YYYY-MM-DD', () => {
    const date = new Date(2026, 0, 15); // Jan 15, 2026
    expect(formatDate(date)).toBe('2026-01-15');
  });

  it('pads single-digit month and day', () => {
    const date = new Date(2026, 2, 5); // Mar 5, 2026
    expect(formatDate(date)).toBe('2026-03-05');
  });

  it('handles December 31st', () => {
    const date = new Date(2026, 11, 31);
    expect(formatDate(date)).toBe('2026-12-31');
  });

  it('handles January 1st', () => {
    const date = new Date(2026, 0, 1);
    expect(formatDate(date)).toBe('2026-01-01');
  });
});
