"use client";

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ViewAllSeatsButton({ libraryId }: { libraryId: string }) {
  const t = useTranslations('library');

  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
      <Link href={`/library/${libraryId}/all-seats`}>
        <Button variant="contained" color="primary" size="large">{t('viewAllSeats')}</Button>
      </Link>
    </motion.div>
  );
}
