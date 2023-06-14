"use client";

import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import findBestBookingPlan from '@/lib/findBestBooking';
import reserve from '@/lib/reservation';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./SeatTile.css";
import Hour from './Hour';

export default function SeatTile({name, description, hours, id, email, date}) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  const handleBookAll = () => {
    const slots = findBestBookingPlan(hours);
    console.log(slots);
    slots.forEach((slot) => {
      reserve(email, date, slot[0], slot[1], id).then((res) => {
        console.log(res);
      
        setIsError(res[0] === 0);
        setMessage(res[1]);
        setHasSubmitted(true);
      });
      console.log('booked ' + slot[0] + ' to ' + slot[1])
    });

  }
  return (
    <div className='seat-tile-box'>
        <p className='text-2xl border-2 border-gray-800'>{name}</p>
        <p>{description}</p>
        <div className='flex flex-wrap'>
          {hours.map((hour, i) => (
            hour.places_available > 0 ? (
              <div className='flex flex-wrap m-1' key={i}>
                <Hour hour={hour}/>
              </div>
            ) : null
          ))}
        </div>
        <div className='mt-2'>
          <Button color='primary' variant="outlined" onClick={handleBookAll}>
            Book All Available
          </Button>
        </div>
        {hasSubmitted && (
          <Alert severity={isError ? 'error' : 'success'} className='rounded-2 mt-3'>{message}</Alert>
        )}


    </div>
  );
}
