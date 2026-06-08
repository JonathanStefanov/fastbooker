"use client";

import Link from 'next/link';
import Button from '@mui/material/Button';

export default function ViewAllSeatsButton({ libraryId }) {
  return (
    <Link href={`/library/${libraryId}/all-seats`}>
      <Button variant="contained" color="primary" size="large">
        View All Seats
      </Button>
    </Link>
  );
}
