import getFloors from './getFloors';
import getSeats from './getSeats';
import type { Seat } from '@/types';

export default async function getAllSeats(libraryId: string, date: string): Promise<Seat[]> {
  const floors = await getFloors(libraryId);
  
  const seatsPromises = floors.map(async (floor) => {
    const seats = await getSeats(libraryId, floor.resource_type, date);
    return seats.flat(1).map(seat => ({
      ...seat,
      floor_name: floor.localized_description,
      floor_id: floor.resource_type,
    }));
  });
  
  const allSeatsArrays = await Promise.all(seatsPromises);
  return allSeatsArrays.flat(1);
}
