import getAllSeats from './getAllSeats';

/**
 * Get the total number of seats for a library.
 * This fetches all seats across all rooms to get an accurate count.
 */
export default async function getLibrarySeatCount(libraryId) {
  try {
    // Use today's date to fetch current available seats
    const today = new Date().toISOString().split('T')[0];
    const seats = await getAllSeats(libraryId, today);
    return seats ? seats.length : 0;
  } catch (error) {
    console.error(`Error fetching seat count for library ${libraryId}:`, error);
    return 0;
  }
}

