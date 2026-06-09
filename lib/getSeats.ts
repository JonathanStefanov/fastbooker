import type { Seat } from '@/types';
import { AFFLUENCES_RESERVATION_API } from './config';

export default async function getSeats(library: string, id: string, date: string): Promise<Seat[]> {
  const response = await fetch(
    `${AFFLUENCES_RESERVATION_API}/resources/${library}/available?date=${date}&type=${id}`,
    { next: { revalidate: 120 } }
  );
  
  const data = await response.json();
  return data;
}
