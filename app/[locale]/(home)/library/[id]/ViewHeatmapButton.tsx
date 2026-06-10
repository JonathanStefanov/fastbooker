'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Button from '@mui/material/Button';
import { motion } from 'framer-motion';

export default function ViewHeatmapButton({ libraryId }: { libraryId: string }) {
  const t = useTranslations('heatmap');

  return (
    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
      <Link href={`/library/${libraryId}/heatmap`}>
        <Button variant="outlined" color="primary" size="large">
          {t('viewHeatmap')}
        </Button>
      </Link>
    </motion.div>
  );
}
