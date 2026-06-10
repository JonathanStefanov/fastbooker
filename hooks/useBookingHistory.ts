'use client';
import { useState, useEffect, useCallback } from 'react';
import { getBookingHistory, getLastBooking, addBooking as add, clearHistory as clear } from '@/lib/bookingHistory';
import type { BookingRecord } from '@/lib/bookingHistory';

export function useBookingHistory() {
  const [history, setHistory] = useState<BookingRecord[]>([]);
  const [lastBooking, setLastBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    setHistory(getBookingHistory());
    setLastBooking(getLastBooking());
  }, []);

  const addBooking = useCallback((record: Omit<BookingRecord, 'bookedAt'>) => {
    const updated = add(record);
    setHistory(updated);
    setLastBooking(updated[0] || null);
  }, []);

  const clearHistory = useCallback(() => {
    clear();
    setHistory([]);
    setLastBooking(null);
  }, []);

  return { history, lastBooking, addBooking, clearHistory };
}
