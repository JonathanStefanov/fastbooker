'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEmail } from '@/components/EmailContext';
import { getLastBooking } from '@/lib/bookingHistory';
import { formatDate } from '@/lib/utils';
import reserve from '@/lib/reservation';
import BookingSuccessModal from '@/components/BookingSuccessModal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import ReplayIcon from '@mui/icons-material/Replay';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChairIcon from '@mui/icons-material/Chair';

export default function QuickRebook() {
  const t = useTranslations('quickRebook');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const { email, requireEmail } = useEmail();

  const [booking, setBooking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookedRange, setBookedRange] = useState<{ start: string; end: string } | null>(null);

  const lastBooking = getLastBooking();

  if (!lastBooking) return null;

  const today = formatDate(new Date());
  const isToday = lastBooking.date === today;

  const handleRebook = async () => {
    if (!requireEmail()) return;
    setBooking(true);
    setError(null);

    try {
      const [result, message] = await reserve(
        email,
        today,
        lastBooking.startTime,
        lastBooking.endTime,
        lastBooking.seatId
      );

      if (result === 1) {
        setBookedRange({ start: lastBooking.startTime, end: lastBooking.endTime });
        setShowSuccess(true);
      } else {
        setError(message || t('bookingFailed'));
      }
    } catch {
      setError(t('bookingFailed'));
    } finally {
      setBooking(false);
    }
  };

  const handleGoToSeat = () => {
    router.push(`/library/${lastBooking.libraryId}/floor/${lastBooking.floorId}`);
  };

  const formatDateNice = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-md mx-auto mb-8"
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
            borderRadius: '16px',
            p: 3,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
          }}
        >
          {/* Decorative circles */}
          <Box sx={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Box sx={{ position: 'absolute', bottom: -15, left: -15, width: 60, height: 60, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.08)' }} />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <ReplayIcon sx={{ fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 600, opacity: 0.9 }}>
                {t('title')}
              </Typography>
              {!isToday && (
                <Chip
                  label={formatDateNice(lastBooking.date)}
                  size="small"
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.7rem', ml: 'auto' }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <ChairIcon sx={{ fontSize: 18, opacity: 0.8 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {lastBooking.seatName}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, opacity: 0.85 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">
                  {lastBooking.startTime} → {lastBooking.endTime}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EventIcon sx={{ fontSize: 16 }} />
                <Typography variant="body2">
                  {isToday ? t('today') : formatDateNice(lastBooking.date)}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Button
                variant="contained"
                onClick={handleRebook}
                disabled={booking}
                data-testid="quick-rebook-btn"
                sx={{
                  bgcolor: 'white',
                  color: '#6366f1',
                  fontWeight: 700,
                  borderRadius: '12px',
                  textTransform: 'none',
                  px: 3,
                  '&:hover': { bgcolor: '#f0f0ff' },
                  flex: 1,
                }}
                startIcon={booking ? <CircularProgress size={18} sx={{ color: '#6366f1' }} /> : <ReplayIcon />}
              >
                {booking ? t('booking') : t('bookAgain')}
              </Button>
              <Button
                variant="outlined"
                onClick={handleGoToSeat}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: 'white',
                  borderRadius: '12px',
                  textTransform: 'none',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                {t('viewSeat')}
              </Button>
            </Box>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box sx={{ mt: 2, p: 1.5, borderRadius: '8px', bgcolor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                    <Typography variant="body2" sx={{ color: '#fecaca' }}>{error}</Typography>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </motion.div>

      <BookingSuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        seatName={lastBooking.seatName}
        startTime={bookedRange?.start}
        endTime={bookedRange?.end}
        date={today}
        email={email}
      />
    </>
  );
}
