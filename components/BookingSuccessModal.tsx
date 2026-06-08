'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AnimatedCheck() {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <motion.div
        className="absolute inset-0 rounded-full bg-green-100"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute inset-2 rounded-full bg-green-500 flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
      >
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-12 h-12 text-white"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            d="M5 13l4 4L19 7"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4, ease: 'easeOut' }}
          />
        </motion.svg>
      </motion.div>
    </div>
  );
}

function Confetti() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: -(Math.random() * 200 + 60),
    rotate: Math.random() * 720 - 360,
    scale: Math.random() * 0.6 + 0.4,
    color: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i % 6],
    delay: Math.random() * 0.3,
    shape: i % 3,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: '50%',
            top: '40%',
            width: p.shape === 2 ? '12px' : '8px',
            height: p.shape === 2 ? '3px' : '8px',
            borderRadius: p.shape === 0 ? '50%' : '2px',
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
          animate={{
            x: p.x,
            y: p.y,
            scale: p.scale,
            rotate: p.rotate,
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1.2,
            delay: 0.4 + p.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </div>
  );
}

interface BookingSuccessModalProps {
  open: boolean;
  onClose: () => void;
  seatName?: string;
  startTime?: string;
  endTime?: string;
  date?: string;
}

export default function BookingSuccessModal({ open, onClose, seatName, startTime, endTime, date }: BookingSuccessModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (open) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => onClose?.(), 6000);
      return () => clearTimeout(timer);
    }
  }, [open, onClose]);

  const formatDateNice = (dateStr?: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    const date = new Date(Number(y), Number(m) - 1, Number(d));
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={onClose}
          initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
          animate={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          exit={{ backgroundColor: 'rgba(0,0,0,0)' }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden relative w-full"
            style={{ maxWidth: '400px' }}
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            {showConfetti && <Confetti />}

            <div className="py-8 px-6 text-center relative overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
            >
              <motion.div
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 bg-white"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-10 bg-white"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.5 }}
              />

              <AnimatedCheck />

              <motion.h2
                className="text-white text-2xl font-bold mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Booked!
              </motion.h2>
            </div>

            <div className="px-6 py-5">
              <motion.div
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                {seatName && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Seat</span>
                    <span className="font-semibold text-gray-900">{seatName}</span>
                  </div>
                )}
                {date && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Date</span>
                    <span className="font-semibold text-gray-900">{formatDateNice(date)}</span>
                  </div>
                )}
                {startTime && endTime && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-500">Time</span>
                    <span className="font-semibold text-gray-900">{startTime} → {endTime}</span>
                  </div>
                )}
              </motion.div>
            </div>

            <div className="px-6 pb-5">
              <motion.button
                onClick={onClose}
                className="w-full py-3 rounded-xl text-white font-semibold text-base shadow-lg"
                style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Done
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
