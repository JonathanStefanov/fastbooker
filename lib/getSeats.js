export default async function getSeats(library, id, date) {
  const response = await fetch(
    'https://reservation.affluences.com/api/resources/' + library + '/available?date=' + date + '&type=' + id,
    { next: { revalidate: 120 } } // Cache for 2 minutes
  );
  
  const data = await response.json();
  return data;
}
