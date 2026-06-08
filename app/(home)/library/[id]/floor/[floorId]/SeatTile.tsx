"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmail } from '@/components/EmailContext';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import findBestBookingPlan from '@/lib/findBestBooking';
import reserve from '@/lib/reservation';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimeSlotBar from './TimeSlotBar';
import BookingSuccessModal from '@/components/BookingSuccessModal';
import type { TimeSlot } from '@/types';

interface SeatTileProps {
  name: string;
  description?: string;
  hours: TimeSlot[];
  id: string;
  date: string;
}

export default function SeatTile({ name, description, hours, id, date }: SeatTileProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);
  const [booking, setBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookedRange, setBookedRange] = useState<{ start: string; end: string } | null>(null);
  const { email, requireEmail } = useEmail();

  const availableHours = hours.filter(hour => hour.places_available > 0);
  const hasAvailableSlots = availableHours.length > 0;

  const handleRangeSelect = (startTime: string, endTime: string) => {
    setSelectedRange({ start: startTime, end: endTime });
  };

  const handleBookSelected = () => {
    if (!requireEmail() || !selectedRange) return;
    setBooking(true);
    reserve(email, date, selectedRange.start, selectedRange.end, id).then((res) => {
      const success = res[0] === 1;
      setIsError(!success);
      setMessage(res[1]);
      setHasSubmitted(true);
      setBooking(false);
      if (success) {
        setBookedRange({ start: selectedRange.start, end: selectedRange.end });
        setShowSuccess(true);
        setSelectedRange(null);
      }
    });
  };

  const handleBookAll = () => {
    if (!requireEmail()) return;
    setBooking(true);
    const slots = findBestBookingPlan(hours);
    let completed = 0;
    let lastResult: [number, string] = [0, ''];
    slots.forEach((slot, index) => {
      setTimeout(() => {
        reserve(email, date, slot[0], slot[1], id).then((res) => {
          lastResult = res;
          completed++;
          if (completed === slots.length) {
            const success = lastResult[0] === 1;
            setIsError(!success);
            setMessage(lastResult[1]);
            setHasSubmitted(true);
            setBooking(false);
            if (success) {
              const firstStart = slots[0][0];
              const lastEnd = slots[slots.length - 1][1];
              setBookedRange({ start: firstStart, end: lastEnd });
              setShowSuccess(true);
            }
          }
        });
      }, index * 1000);
    });
  };

  return (
    <>
      <motion.div layout whileHover={hasAvailableSlots ? { scale: 1.005 } : {}} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
        <ListItem sx={{ flexDirection: 'column', alignItems: 'stretch', border: '1px solid #e5e7eb', borderRadius: '8px', mb: 2, p: 0, overflow: 'hidden', backgroundColor: hasAvailableSlots ? '#ffffff' : '#f9fafb' }}>
          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, cursor: hasAvailableSlots ? 'pointer' : 'default', '&:hover': hasAvailableSlots ? { backgroundColor: '#f9fafb' } : {} }}
            onClick={() => hasAvailableSlots && setExpanded(!expanded)}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>{name}</Typography>
              {description && <Typography variant="body2" sx={{ color: '#6b7280' }}>{description}</Typography>}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {hasAvailableSlots ? (
                <>
                  <Chip label={`${availableHours.length} slot${availableHours.length !== 1 ? 's' : ''}`} size="small" sx={{ backgroundColor: '#22c55e', color: 'white', fontWeight: 600 }} />
                  <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <IconButton size="small"><ExpandMoreIcon /></IconButton>
                  </motion.div>
                </>
              ) : (
                <Chip label="No available slots" size="small" sx={{ backgroundColor: '#ef4444', color: 'white', fontWeight: 600 }} />
              )}
            </Box>
          </Box>

          <AnimatePresence initial={false}>
            {expanded && hasAvailableSlots && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: 'hidden' }}>
                <Box sx={{ p: 2, pt: 0, borderTop: '1px solid #e5e7eb' }}>
                  <Box sx={{ mt: 2, mb: 2 }}><TimeSlotBar hours={hours} onSelect={handleRangeSelect} /></Box>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    <AnimatePresence>
                      {selectedRange && (
                        <motion.div initial={{ opacity: 0, scale: 0.9, x: -10 }} animate={{ opacity: 1, scale: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9, x: -10 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
                          <Button variant="contained" onClick={(e) => { e.stopPropagation(); handleBookSelected(); }} disabled={booking} sx={{ backgroundColor: '#1d4ed8', '&:hover': { backgroundColor: '#1e40af' } }}>
                            {booking ? (
                              <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>Booking...</motion.span>
                            ) : (
                              `Book ${selectedRange.start} → ${selectedRange.end}`
                            )}
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Button variant="outlined" color="primary" onClick={(e) => { e.stopPropagation(); handleBookAll(); }} disabled={booking}>
                      Book All Available
                    </Button>
                  </Box>
                  <AnimatePresence>
                    {hasSubmitted && isError && (
                      <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} transition={{ duration: 0.3 }}>
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{message}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </ListItem>
      </motion.div>
      <BookingSuccessModal open={showSuccess} onClose={() => setShowSuccess(false)} seatName={name} startTime={bookedRange?.start} endTime={bookedRange?.end} date={date} />
    </>
  );
}
