import type { Seat } from '@/types';

export default async function getSeats(library: string, id: string, date: string): Promise<Seat[]> {
  const response = await fetch(
    'https://reservation.affluences.com/api/resources/' + library + '/available?date=' + date + '&type=' + id,
    { next: { revalidate: 120 } }
  );
  
  const data = await response.json();
  return data;
}
