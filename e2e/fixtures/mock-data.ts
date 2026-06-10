export const mockLibraries = [
  {
    id: 'lib-1',
    primary_name: 'Bibliothèque des Sciences',
    secondary_name: 'Solbosch',
    poster_image: null,
    latitude: 50.81,
    longitude: 4.38,
  },
  {
    id: 'lib-2',
    primary_name: 'Bibliothèque de Philosophie',
    secondary_name: 'LLN',
    poster_image: null,
    latitude: 50.67,
    longitude: 4.61,
  },
  {
    id: 'lib-3',
    primary_name: 'Bibliothèque Droit',
    secondary_name: 'Centre',
    poster_image: null,
    latitude: 50.84,
    longitude: 4.35,
  },
];

export const mockFloors = [
  {
    id: 'floor-1',
    name: 'Rez-de-chaussée',
    level: 0,
    library_id: 'lib-1',
  },
  {
    id: 'floor-2',
    name: 'Premier étage',
    level: 1,
    library_id: 'lib-1',
  },
];

export const mockSeats = [
  {
    id: 'seat-1',
    name: 'A1',
    floor_id: 'floor-1',
    status: 'available',
    outlet: true,
    near_window: false,
  },
  {
    id: 'seat-2',
    name: 'A2',
    floor_id: 'floor-1',
    status: 'reserved',
    outlet: false,
    near_window: true,
  },
  {
    id: 'seat-3',
    name: 'B1',
    floor_id: 'floor-1',
    status: 'available',
    outlet: true,
    near_window: true,
  },
  {
    id: 'seat-4',
    name: 'C1',
    floor_id: 'floor-2',
    status: 'available',
    outlet: false,
    near_window: false,
  },
];

export const mockTimeslots = [
  { id: 'ts-1', start_time: '08:00', end_time: '09:00', status: 'available' },
  { id: 'ts-2', start_time: '09:00', end_time: '10:00', status: 'reserved' },
  { id: 'ts-3', start_time: '10:00', end_time: '11:00', status: 'available' },
];

export const mockHeatmapData = [
  {
    date: '2026-06-10',
    dayName: 'Wed',
    dayNumber: 10,
    isToday: true,
    slots: [
      { hour: '08:00', available: 10, total: 20 },
      { hour: '08:30', available: 8, total: 20 },
      { hour: '09:00', available: 3, total: 20 },
      { hour: '09:30', available: 0, total: 20 },
      { hour: '10:00', available: 12, total: 20 },
    ],
  },
  {
    date: '2026-06-11',
    dayName: 'Thu',
    dayNumber: 11,
    isToday: false,
    slots: [
      { hour: '08:00', available: 15, total: 20 },
      { hour: '08:30', available: 14, total: 20 },
      { hour: '09:00', available: 10, total: 20 },
      { hour: '09:30', available: 6, total: 20 },
      { hour: '10:00', available: 2, total: 20 },
    ],
  },
  {
    date: '2026-06-12',
    dayName: 'Fri',
    dayNumber: 12,
    isToday: false,
    slots: [
      { hour: '08:00', available: 0, total: 20 },
      { hour: '08:30', available: 0, total: 20 },
      { hour: '09:00', available: 0, total: 20 },
      { hour: '09:30', available: 0, total: 20 },
      { hour: '10:00', available: 0, total: 20 },
    ],
  },
  {
    date: '2026-06-13',
    dayName: 'Sat',
    dayNumber: 13,
    isToday: false,
    slots: [],
  },
  {
    date: '2026-06-14',
    dayName: 'Sun',
    dayNumber: 14,
    isToday: false,
    slots: [],
  },
  {
    date: '2026-06-15',
    dayName: 'Mon',
    dayNumber: 15,
    isToday: false,
    slots: [
      { hour: '08:00', available: 20, total: 20 },
      { hour: '08:30', available: 18, total: 20 },
      { hour: '09:00', available: 15, total: 20 },
      { hour: '09:30', available: 12, total: 20 },
      { hour: '10:00', available: 8, total: 20 },
    ],
  },
  {
    date: '2026-06-16',
    dayName: 'Tue',
    dayNumber: 16,
    isToday: false,
    slots: [
      { hour: '08:00', available: 5, total: 20 },
      { hour: '08:30', available: 3, total: 20 },
      { hour: '09:00', available: 1, total: 20 },
      { hour: '09:30', available: 0, total: 20 },
      { hour: '10:00', available: 0, total: 20 },
    ],
  },
];

export const mockSeatData = [
  {
    id: 'seat-1',
    resource_name: 'A1',
    resource_id: 'res-1',
    description: 'Seat A1',
    hours: [
      { hour: '08:00', places_available: 5, status: 'available' },
      { hour: '08:30', places_available: 5, status: 'available' },
      { hour: '09:00', places_available: 0, status: 'unavailable' },
      { hour: '09:30', places_available: 5, status: 'available' },
    ],
  },
  {
    id: 'seat-2',
    resource_name: 'A2',
    resource_id: 'res-2',
    description: 'Seat A2',
    hours: [
      { hour: '08:00', places_available: 5, status: 'available' },
      { hour: '08:30', places_available: 5, status: 'available' },
      { hour: '09:00', places_available: 5, status: 'available' },
      { hour: '09:30', places_available: 5, status: 'available' },
    ],
  },
  {
    id: 'seat-3',
    resource_name: 'B1',
    resource_id: 'res-3',
    description: 'Seat B1',
    hours: [
      { hour: '08:00', places_available: 0, status: 'unavailable' },
      { hour: '08:30', places_available: 0, status: 'unavailable' },
      { hour: '09:00', places_available: 5, status: 'available' },
      { hour: '09:30', places_available: 5, status: 'available' },
    ],
  },
];
