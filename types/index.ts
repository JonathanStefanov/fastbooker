// ── University ──
export interface UniversityColors {
  primary: string;
  gradient: string;
  chipBg: string;
  chipText: string;
  selectedDate: string;
  hoverDate: string;
}

export interface LibraryOverride {
  forceBookingAvailable?: boolean;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  searchQuery: string;
  emailDomain: string;
  country?: string;
  city?: string;
  colors: UniversityColors;
  libraryOverrides: Record<string, LibraryOverride>;
}

// ── Affluences API ──
export interface Library {
  id: string;
  primary_name: string;
  slug?: string;
  booking_available?: boolean;
  image_url?: string;
  address?: string;
  [key: string]: unknown;
}

export interface Floor {
  resource_type: string;
  localized_description: string;
  image?: string;
}

export interface TimeSlot {
  hour: string;
  places_available: number;
  status: 'available' | 'reserved' | 'unavailable';
  id?: string;
}

export interface Seat {
  id: string;
  name?: string;
  resource_name: string;
  resource_id: string;
  description: string;
  hours: TimeSlot[];
  floor_name?: string;
  floor_id?: string;
  [key: string]: unknown;
}

export interface BookingResult {
  success: boolean;
  message: string;
}

export interface BookingBlock {
  startTime: string;
  endTime: string;
  seatId: string;
  seatName: string;
}
