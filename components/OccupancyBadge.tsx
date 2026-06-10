'use client';

import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import { useTranslations } from 'next-intl';
import type { OccupancyData } from '@/app/api/occupancy/route';

function getOccupancyColor(pct: number): string {
  if (pct >= 80) return '#ef4444';
  if (pct >= 50) return '#f59e0b';
  return '#22c55e';
}

function getOccupancyLabel(pct: number, t: ReturnType<typeof useTranslations>): string {
  if (pct >= 80) return t('status.busy');
  if (pct >= 50) return t('status.moderate');
  return t('status.quiet');
}

interface OccupancyBadgeProps {
  libraryId: string;
}

export default function OccupancyBadge({ libraryId }: OccupancyBadgeProps) {
  const t = useTranslations('occupancy');

  const { data, isLoading, error } = useQuery({
    queryKey: ['occupancy', libraryId],
    queryFn: async () => {
      const res = await fetch(`/api/occupancy?library=${libraryId}`);
      if (!res.ok) throw new Error('Failed to fetch occupancy');
      return res.json() as Promise<OccupancyData>;
    },
    staleTime: 2 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (error || !data || data.currentOccupancy === null) return null;

  const pct = data.currentOccupancy;
  const color = getOccupancyColor(pct);
  const label = getOccupancyLabel(pct, t);
  const size = 100;
  const thickness = 6;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {/* Background circle */}
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700, color, lineHeight: 1 }}>
            {pct}%
          </Typography>
        </Box>
      </Box>
      <Chip
        label={label}
        size="small"
        sx={{
          bgcolor: `${color}18`,
          color,
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />
      {!data.currentOpened && (
        <Chip label={t('closed')} size="small" color="default" variant="outlined" />
      )}
    </Box>
  );
}
