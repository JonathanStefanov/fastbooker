import getFloors from './getFloors';
import getSeats from './getSeats';

export default async function getAllSeats(libraryId, date) {
  // Get all floors/rooms for the library
  const floors = await getFloors(libraryId);
  
  // Fetch seats for all floors in parallel
  const seatsPromises = floors.map(async (floor) => {
    const seats = await getSeats(libraryId, floor.resource_type, date);
    // Flatten the seats array and add floor information to each seat
    return seats.flat(1).map(seat => ({
      ...seat,
      floor_name: floor.localized_description,
      floor_id: floor.resource_type
    }));
  });
  
  // Wait for all seats to be fetched
  const allSeatsArrays = await Promise.all(seatsPromises);
  
  // Flatten all seats into a single array
  return allSeatsArrays.flat(1);
}
