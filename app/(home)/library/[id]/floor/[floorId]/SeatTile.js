"use client";

import * as React from 'react';
import { useState } from 'react';
import { useEmail } from '@/components/EmailContext';
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
import TimeSlotBar from './TimeSlotBar';

export default function SeatTile({name, description, hours, id, date}) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [selectedRange, setSelectedRange] = useState(null);
  const [booking, setBooking] = useState(false);
  const { email, requireEmail } = useEmail();

  const availableHours = hours.filter(hour => hour.places_available > 0);
  const hasAvailableSlots = availableHours.length > 0;

  const handleRangeSelect = (startTime, endTime) => {
    setSelectedRange({ start: startTime, end: endTime });
  };

  const handleBookSelected = () => {
    if (!requireEmail() || !selectedRange) return;
    setBooking(true);
    reserve(email, date, selectedRange.start, selectedRange.end, id).then((res) => {
      setIsError(res[0] === 0);
      setMessage(res[1]);
      setHasSubmitted(true);
      setBooking(false);
      if (res[0] === 1) setSelectedRange(null);
    });
  };

  const handleBookAll = () => {
    if (!requireEmail()) return;
    setBooking(true);
    const slots = findBestBookingPlan(hours);
    let completed = 0;
    let lastResult = null;
    slots.forEach((slot, index) => {
      setTimeout(() => {
        reserve(email, date, slot[0], slot[1], id).then((res) => {
          lastResult = res;
          completed++;
          if (completed === slots.length) {
            setIsError(lastResult[0] === 0);
            setMessage(lastResult[1]);
            setHasSubmitted(true);
            setBooking(false);
          }
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
            {/* Time slot bar */}
            <Box sx={{ mt: 2, mb: 2 }}>
              <TimeSlotBar hours={hours} onSelect={handleRangeSelect} />
            </Box>

            {/* Action buttons */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {selectedRange && (
                <Button
                  variant="contained"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookSelected();
                  }}
                  disabled={booking}
                  sx={{ backgroundColor: '#1d4ed8', '&:hover': { backgroundColor: '#1e40af' } }}
                >
                  {booking ? 'Booking...' : `Book ${selectedRange.start} → ${selectedRange.end}`}
                </Button>
              )}
              <Button
                variant="outlined"
                color="primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookAll();
                }}
                disabled={booking}
              >
                Book All Available
              </Button>
            </Box>

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
