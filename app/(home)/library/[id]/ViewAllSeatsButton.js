"use client";

import Link from 'next/link';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';

export default function ViewAllSeatsButton({ libraryId }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <Link href={`/library/${libraryId}/all-seats`}>
        <Button variant="contained" color="primary" size="large">
          View All Seats
        </Button>
      </Link>
    </motion.div>
  );
}
