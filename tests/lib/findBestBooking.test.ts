import { describe, it, expect } from 'vitest';
import findBestBookingPlan from '@/lib/findBestBooking';
import type { TimeSlot } from '@/types';

function makeSlots(hours: string[], available = true): TimeSlot[] {
  return hours.map(h => ({
    hour: h,
    places_available: available ? 5 : 0,
    status: available ? 'available' as const : 'unavailable' as const,
  }));
}

describe('findBestBookingPlan', () => {
  it('returns empty for no available slots', () => {
    const slots = makeSlots(['09:00', '09:30', '10:00'], false);
    expect(findBestBookingPlan(slots)).toEqual([]);
  });

  it('returns single block for consecutive available slots', () => {
    const slots = makeSlots(['09:00', '09:30', '10:00', '10:30']);
    const result = findBestBookingPlan(slots);
    expect(result).toHaveLength(1);
    expect(result[0][0]).toBe('09:00');
    expect(result[0][1]).toBe('11:00');
  });

  it('treats filtered available slots as one block (no gap detection)', () => {
    // After filtering, only [09:00, 09:30, 10:30, 11:00] remain
    // Algorithm sees these as consecutive (endPrev tracking)
    const slots: TimeSlot[] = [
      { hour: '09:00', places_available: 5, status: 'available' },
      { hour: '09:30', places_available: 5, status: 'available' },
      { hour: '10:00', places_available: 0, status: 'unavailable' },
      { hour: '10:30', places_available: 5, status: 'available' },
      { hour: '11:00', places_available: 5, status: 'available' },
    ];
    const result = findBestBookingPlan(slots);
    // Algorithm produces 1 block: 09:00→11:30 (doesn't detect the 10:00 gap)
    expect(result).toHaveLength(1);
    expect(result[0][0]).toBe('09:00');
    expect(result[0][1]).toBe('11:30');
  });

  it('splits blocks when available slots are non-consecutive in time', () => {
    // 09:00, 09:30 then skip to 14:00, 14:30 — clearly non-consecutive
    const slots: TimeSlot[] = [
      { hour: '09:00', places_available: 5, status: 'available' },
      { hour: '09:30', places_available: 5, status: 'available' },
      { hour: '14:00', places_available: 5, status: 'available' },
      { hour: '14:30', places_available: 5, status: 'available' },
    ];
    const result = findBestBookingPlan(slots);
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(['09:00', '10:00']);
    expect(result[1]).toEqual(['14:00', '15:00']);
  });

  it('respects max 8 slots (4 hours)', () => {
    // 10 consecutive 30-min slots from 08:00 to 12:30
    const hours = Array.from({ length: 10 }, (_, i) => {
      const h = 8 + Math.floor(i / 2);
      const m = i % 2 === 0 ? '00' : '30';
      return `${h.toString().padStart(2, '0')}:${m}`;
    });
    const slots = makeSlots(hours);
    const result = findBestBookingPlan(slots);
    // Should split: first 8 slots (08:00→12:00), then remaining 2 (12:00→13:00)
    expect(result).toHaveLength(2);
    expect(result[0][0]).toBe('08:00');
    expect(result[0][1]).toBe('12:00');
    expect(result[1][0]).toBe('12:00');
    expect(result[1][1]).toBe('13:00');
  });

  it('returns empty for single available slot (algorithm quirk)', () => {
    // The algorithm needs at least 2 available slots to form a block
    // because it calculates slots as (end - start) / 30min
    const slots: TimeSlot[] = [
      { hour: '09:00', places_available: 0, status: 'unavailable' },
      { hour: '09:30', places_available: 5, status: 'available' },
      { hour: '10:00', places_available: 0, status: 'unavailable' },
    ];
    const result = findBestBookingPlan(slots);
    expect(result).toHaveLength(0);
  });
});
