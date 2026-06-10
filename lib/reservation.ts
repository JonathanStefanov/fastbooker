export default async function reserve(
  email: string,
  date: string,
  start_time: string,
  end_time: string,
  id: string
): Promise<[number, string]> {
  try {
    const response = await fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ seatId: id, email, date, start_time, end_time }),
    });

    const data = await response.json();

    if (!response.ok) {
      return [0, data.error || 'Reservation failed'];
    }

    return [1, data.successMessage || 'Reservation successful!'];
  } catch (error) {
    return [0, 'Reservation failed'];
  }
}
