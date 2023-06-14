import axios from 'axios';

export default function reserve(email, date, start_time, end_time, id){
  const url = 'https://reservation.affluences.com/api/reserve/' + id;
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/plain, */*',
  };

  
  const data = {
    auth_type: null,
    email: email,
    date: date,
    start_time: start_time,
    end_time: end_time,
    note: null,
    user_firstname: null,
    user_lastname: null,
    user_phone: null,
    person_count: 1,
  };

  console.log('data;');
  console.log(data);

  axios.post(url, data, { headers })
    .then(response => {
      console.log(response.data);
      // Handle the response data
    })
    .catch(error => {
      console.error(error);
      // Handle the error
    });
}