'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import OccupancyHeatmap from '@/components/OccupancyHeatmap';

export default function HeatmapPage({ params }: { params: { id: string } }) {
  const t = useTranslations('occupancy');
  const router = useRouter();

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1f2937' }}>
            {t('pageTitle')}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#6b7280', mb: 4, ml: '52px' }}>
          {t('pageSubtitle')}
        </Typography>

        {/* Occupancy Heatmap */}
        <OccupancyHeatmap libraryId={params.id} />
      </div>
    </div>
  );
}
