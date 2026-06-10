import { describe, it, expect, vi, beforeEach } from 'vitest';

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();
vi.stubGlobal('localStorage', localStorageMock);

import { getBookingHistory, addBooking, getLastBooking, clearHistory } from '@/lib/bookingHistory';

const makeRecord = (overrides = {}) => ({
  seatId: 'seat-1',
  seatName: 'A 1',
  libraryId: 'lib-1',
  floorId: 'floor-1',
  date: '2026-06-10',
  startTime: '09:00',
  endTime: '12:00',
  email: 'test@uni.edu',
  ...overrides,
});

describe('bookingHistory', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('returns empty array when no history', () => {
    expect(getBookingHistory()).toEqual([]);
  });

  it('adds a booking and retrieves it', () => {
    const record = makeRecord();
    addBooking(record);
    const history = getBookingHistory();
    expect(history).toHaveLength(1);
    expect(history[0].seatId).toBe('seat-1');
    expect(history[0].bookedAt).toBeTypeOf('number');
  });

  it('getLastBooking returns most recent', () => {
    addBooking(makeRecord({ seatId: 'old', date: '2026-06-01' }));
    addBooking(makeRecord({ seatId: 'new', date: '2026-06-10' }));
    const last = getLastBooking();
    expect(last?.seatId).toBe('new');
  });

  it('returns null when no history', () => {
    expect(getLastBooking()).toBeNull();
  });

  it('deduplicates same seat+date+startTime', () => {
    addBooking(makeRecord());
    addBooking(makeRecord({ seatName: 'Updated Name' }));
    const history = getBookingHistory();
    expect(history).toHaveLength(1);
    expect(history[0].seatName).toBe('Updated Name');
  });

  it('keeps different time slots separate', () => {
    addBooking(makeRecord({ startTime: '09:00', endTime: '12:00' }));
    addBooking(makeRecord({ startTime: '14:00', endTime: '17:00' }));
    expect(getBookingHistory()).toHaveLength(2);
  });

  it('limits history to 10 entries', () => {
    for (let i = 0; i < 15; i++) {
      addBooking(makeRecord({ seatId: `seat-${i}`, startTime: `${8 + i}:00`, endTime: `${9 + i}:00` }));
    }
    expect(getBookingHistory()).toHaveLength(10);
    // Most recent first
    expect(getBookingHistory()[0].seatId).toBe('seat-14');
  });

  it('clearHistory removes everything', () => {
    addBooking(makeRecord());
    addBooking(makeRecord({ seatId: 'seat-2', startTime: '14:00', endTime: '17:00' }));
    clearHistory();
    expect(getBookingHistory()).toEqual([]);
  });
});
