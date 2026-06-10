const STORAGE_KEY = 'fastbooker-booking-history';
const MAX_HISTORY = 10;

export interface BookingRecord {
  seatId: string;
  seatName: string;
  libraryId: string;
  floorId: string;
  date: string;
  startTime: string;
  endTime: string;
  email: string;
  bookedAt: number; // timestamp
}

export function getBookingHistory(): BookingRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addBooking(record: Omit<BookingRecord, 'bookedAt'>): BookingRecord[] {
  const history = getBookingHistory();
  const entry: BookingRecord = { ...record, bookedAt: Date.now() };
  // Deduplicate: remove existing entry with same seatId + date + startTime
  const filtered = history.filter(
    (h) => !(h.seatId === record.seatId && h.date === record.date && h.startTime === record.startTime)
  );
  const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function getLastBooking(): BookingRecord | null {
  const history = getBookingHistory();
  return history.length > 0 ? history[0] : null;
}

export function clearHistory(): void {
  localStorage.removeItem(STORAGE_KEY);
}
