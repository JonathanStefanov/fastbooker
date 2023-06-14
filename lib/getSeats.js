export default async function getSeats(id, date) {
    const response = await fetch(
      'https://reservation.affluences.com/api/resources/8e938621-0918-4a4b-89c2-71e879fb341c/available?date=' + date + '&type=' + id
    );
    
    const data = await response.json();
    return data;
  }