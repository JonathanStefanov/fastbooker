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
