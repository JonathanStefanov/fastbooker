export default async function getBSHFloors() {
  const response = await fetch(
    'https://reservation.affluences.com/api/site/8e938621-0918-4a4b-89c2-71e879fb341c/types'
  );
  
  const data = await response.json();
  return data.types;
}