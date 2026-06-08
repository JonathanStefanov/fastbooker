"use client";

import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import findBestBookingPlan from '@/lib/findBestBooking';
import reserve from '@/lib/reservation';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import Hour from './Hour';

export default function SeatTile({name, description, hours, id, email, date}) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);

  const availableHours = hours.filter(hour => hour.places_available > 0);
  const hasAvailableSlots = availableHours.length > 0;

  const handleBookSlot = (hour) => {
    // Calculate end time (30 minutes after start time)
    const startTime = hour.hour;
    const endTime = new Date(`1970-01-01T${startTime}:00`);
    endTime.setMinutes(endTime.getMinutes() + 30);
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;
    
    reserve(email, date, startTime, endTimeStr, id).then((res) => {
      console.log(res);
      setIsError(res[0] === 0);
      setMessage(res[1]);
      setHasSubmitted(true);
    });
  };

  const handleBookAll = () => {
    const slots = findBestBookingPlan(hours);
    slots.forEach((slot, index) => {
      setTimeout(() => {
        reserve(email, date, slot[0], slot[1], id).then((res) => {
          console.log(res);
          setIsError(res[0] === 0);
          setMessage(res[1]);
          setHasSubmitted(true);
        });
      }, index * 1000);
    });
  };
  
  return (
    <ListItem
      sx={{
        flexDirection: 'column',
        alignItems: 'stretch',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        mb: 2,
        p: 0,
        overflow: 'hidden',
        backgroundColor: hasAvailableSlots ? '#ffffff' : '#f9fafb'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          cursor: hasAvailableSlots ? 'pointer' : 'default',
          '&:hover': hasAvailableSlots ? {
            backgroundColor: '#f9fafb'
          } : {}
        }}
        onClick={() => hasAvailableSlots && setExpanded(!expanded)}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
            {name}
          </Typography>
          {description && (
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              {description}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {hasAvailableSlots ? (
            <>
              <Chip
                label={`${availableHours.length} slot${availableHours.length !== 1 ? 's' : ''}`}
                size="small"
                sx={{
                  backgroundColor: '#22c55e',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <IconButton size="small">
                {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </>
          ) : (
            <Chip
              label="No available slots"
              size="small"
              sx={{
                backgroundColor: '#ef4444',
                color: 'white',
                fontWeight: 600
              }}
            />
          )}
        </Box>
      </Box>

      {hasAvailableSlots && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ p: 2, pt: 0, borderTop: '1px solid #e5e7eb' }}>
            <Typography variant="body2" sx={{ color: '#6b7280', mb: 2, fontWeight: 500 }}>
              Available time slots:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {availableHours.map((hour, i) => (
                <Hour key={i} hour={hour} onClick={() => handleBookSlot(hour)}/>
              ))}
            </Box>

            <Button
              color='primary'
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                handleBookAll();
              }}
              sx={{ mt: 1 }}
            >
              Book All Available
            </Button>

            {hasSubmitted && (
              <Alert severity={isError ? 'error' : 'success'} sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
          </Box>
        </Collapse>
      )}
    </ListItem>
  );
}
