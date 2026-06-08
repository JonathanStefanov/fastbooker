export default async function getFloors(id) {
  const response = await fetch(
    'https://reservation.affluences.com/api/site/' + id + '/types',
    { next: { revalidate: 3600 } } // Cache for 1 hour
  );
  
  const data = await response.json();
  return data.types;
}
