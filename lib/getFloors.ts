import type { Floor } from '@/types';
import { AFFLUENCES_RESERVATION_API } from './config';

export default async function getFloors(id: string): Promise<Floor[]> {
  const response = await fetch(
    `${AFFLUENCES_RESERVATION_API}/site/${id}/types`,
    { next: { revalidate: 3600 } }
  );
  
  const data = await response.json();
  return data.types;
}
