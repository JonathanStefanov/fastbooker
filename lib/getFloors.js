export default async function getFloors(id) {
  const response = await fetch(
    'https://reservation.affluences.com/api/site/' + id + '/types'
  );
  
  const data = await response.json();
  return data.types;
}