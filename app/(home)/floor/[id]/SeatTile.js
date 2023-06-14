"use client";

import * as React from 'react';
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
  const handleBookAll = () => {
    const slots = findBestBookingPlan(hours);
    console.log(slots);
    slots.forEach((slot) => {
      reserve(email, date, slot[0], slot[1], id);
      console.log('booked ' + slot[0] + ' to ' + slot[1])
    });

  }
  return (
    <div className='seat-tile-box'>
        <p className='text-2xl border-2 border-gray-800'>{name}</p>
        <p>{description}</p>
        <div className='flex flex-wrap'>
          {hours.map((hour) => (
            hour.places_available > 0 ? (
              <div className='flex flex-wrap m-1'>
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
        <Alert severity="error">This is an error alert — check it out!</Alert>


    </div>
  );
}
