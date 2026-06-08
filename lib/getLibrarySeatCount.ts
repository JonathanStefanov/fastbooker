import getAllSeats from './getAllSeats';

export default async function getLibrarySeatCount(libraryId: string): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const seats = await getAllSeats(libraryId, today);
    return seats?.length ?? 0;
  } catch (error) {
    console.error(`Error fetching seat count for library ${libraryId}:`, error);
    return 0;
  }
}
