"use client";

import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import getSeats from '@/lib/getSeats';
import { formatDate } from '@/lib/utils';
import DateSelector from './DateSelector';
import SeatTile from './SeatTile';

export default function Floor({ params }) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [seats, setSeats] = useState(null);
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    getSeats(params.id, selectedDate).then((data) => {
      const allSeats = data.flat(1);
      setSeats(allSeats);
      console.log(allSeats);
    });
  }, [params.id, selectedDate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="mt-3">
      <center>
        <div className='flex flex-wrap mt-2'>
          <div className='flex-1'>
            <TextField id="outlined-basic" label="ULB Email" variant="outlined" className="m-3" value={email} onChange={handleEmailChange} />
          </div>
          <div className='flex-1 mt-2'>
            <DateSelector onDateChange={handleDateChange} />
          </div>
          <div className='flex-1'>
            <TextField id="outlined-basic" label="Search" variant="outlined" className="m-3" value={search} onChange={handleSearchChange} />
          </div>
        </div>
        {seats &&
          seats
            .filter((seat) => seat.resource_name.toLowerCase().includes(search.toLowerCase()) || seat.description.toLowerCase().includes(search.toLowerCase()))
            .map((seat, i) => (
              <div key={i}>
              <SeatTile
                id={seat.resource_id}
                name={seat.resource_name}
                description={seat.description}
                date={selectedDate}
                hours={seat.hours}
                email={email}
              />
              </div>
            ))}
      </center>
    </div>
  );
}