import axios from 'axios';

export default async function reserve(
  email: string,
  date: string,
  start_time: string,
  end_time: string,
  id: string
): Promise<[number, string]> {
  const url = 'https://reservation.affluences.com/api/reserve/' + id;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
  };

  const data = {
    auth_type: null,
    email,
    date,
    start_time,
    end_time,
    note: null,
    user_firstname: null,
    user_lastname: null,
    user_phone: null,
    person_count: 1,
  };

  return axios.post(url, data, { headers })
    .then(response => {
      return [1, response.data.successMessage] as [number, string];
    })
    .catch(error => {
      return [0, error.response?.data?.errorMessage || 'Reservation failed'] as [number, string];
    });
}
