import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

vi.mock('@/lib/bookingHistory', () => {
  let store: Array<Record<string, unknown>> = [];
  return {
    getBookingHistory: vi.fn(() => [...store]),
    getLastBooking: vi.fn(() => (store.length > 0 ? store[0] : null)),
    addBooking: vi.fn((record: Record<string, unknown>) => {
      const entry = { ...record, bookedAt: Date.now() };
      store = [entry, ...store.filter((h) =>
        !(h.seatId === record.seatId && h.date === record.date && h.startTime === record.startTime)
      )].slice(0, 10);
      return [...store];
    }),
    clearHistory: vi.fn(() => { store = []; }),
  };
});

import { useBookingHistory } from '@/hooks/useBookingHistory';

const makeRecord = () => ({
  seatId: 'seat-1',
  seatName: 'A 1',
  libraryId: 'lib-1',
  floorId: 'floor-1',
  date: '2026-06-10',
  startTime: '09:00',
  endTime: '12:00',
  email: 'test@uni.edu',
});

describe('useBookingHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with empty state', () => {
    const { result } = renderHook(() => useBookingHistory());
    expect(result.current.history).toEqual([]);
    expect(result.current.lastBooking).toBeNull();
  });

  it('adds a booking and updates state', () => {
    const { result } = renderHook(() => useBookingHistory());
    act(() => { result.current.addBooking(makeRecord()); });
    expect(result.current.history).toHaveLength(1);
    expect(result.current.lastBooking?.seatId).toBe('seat-1');
  });

  it('clears history', () => {
    const { result } = renderHook(() => useBookingHistory());
    act(() => { result.current.addBooking(makeRecord()); });
    expect(result.current.history).toHaveLength(1);
    act(() => { result.current.clearHistory(); });
    expect(result.current.history).toEqual([]);
    expect(result.current.lastBooking).toBeNull();
  });
});
