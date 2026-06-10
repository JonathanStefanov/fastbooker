'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { useUniversity } from '@/components/UniversityContext';
import type { HeatmapDay } from '@/app/api/heatmap/route';

function getAvailabilityColor(available: number, total: number): string {
  if (total === 0) return '#e5e7eb';
  const ratio = available / total;
  if (ratio >= 0.6) return '#22c55e';
  if (ratio >= 0.3) return '#f59e0b';
  if (ratio > 0) return '#f97316';
  return '#ef4444';
}

function getAvailabilityRatio(available: number, total: number): number {
  if (total === 0) return 0;
  return available / total;
}

interface AvailabilityHeatmapProps {
  libraryId: string;
}

export default function AvailabilityHeatmap({ libraryId }: AvailabilityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ dayIdx: number; slotIdx: number } | null>(null);
  const t = useTranslations('heatmap');
  const router = useRouter();
  const { university } = useUniversity();

  const { data: heatmapData, isLoading, error } = useQuery({
    queryKey: ['heatmap', libraryId],
    queryFn: async () => {
      const res = await fetch(`/api/heatmap?library=${libraryId}`);
      if (!res.ok) throw new Error('Failed to fetch heatmap');
      return res.json() as Promise<HeatmapDay[]>;
    },
    staleTime: 5 * 60 * 1000,
  });

  const allSlots = useMemo(() => {
    if (!heatmapData) return [];
    const slotSet = new Set<string>();
    for (const day of heatmapData) {
      for (const slot of day.slots) slotSet.add(slot.hour);
    }
    return Array.from(slotSet).sort();
  }, [heatmapData]);

  const lookup = useMemo(() => {
    if (!heatmapData) return new Map<string, { available: number; total: number }>();
    const map = new Map<string, { available: number; total: number }>();
    for (let d = 0; d < heatmapData.length; d++) {
      for (const slot of heatmapData[d].slots) {
        map.set(`${d}-${slot.hour}`, { available: slot.available, total: slot.total });
      }
    }
    return map;
  }, [heatmapData]);

  const handleCellClick = (date: string) => {
    router.push(`/library/${libraryId}/all-seats?date=${date}`);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error || !heatmapData) return null;

  const validDays = heatmapData.filter(d => d.slots.length > 0);
  if (validDays.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" sx={{ color: '#9ca3af' }}>{t('noData')}</Typography>
      </Box>
    );
  }

  const displaySlots = allSlots.filter(hour =>
    validDays.some(day => day.slots.some(s => s.hour === hour))
  );

  // Sample labels to avoid overcrowding
  const step = Math.max(1, Math.floor(displaySlots.length / 16));
  const sampledSlots = new Set(
    displaySlots.filter((_, i) => i % step === 0 || i === displaySlots.length - 1)
  );

  const hovered = hoveredCell
    ? (() => {
        const day = validDays[hoveredCell.dayIdx];
        const hour = displaySlots[hoveredCell.slotIdx];
        const data = lookup.get(`${heatmapData.indexOf(day)}-${hour}`);
        return { day, hour, available: data?.available ?? 0, total: data?.total ?? 0 };
      })()
    : null;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Day headers */}
      <Box sx={{ display: 'flex', gap: 1, mb: 0.5, pl: '70px' }}>
        {validDays.map((day) => (
          <Box key={day.date} sx={{ flex: 1, textAlign: 'center' }}>
            <Chip
              label={day.dayName}
              size="small"
              sx={{
                fontWeight: day.isToday ? 700 : 500,
                bgcolor: day.isToday ? university.colors.primary : 'transparent',
                color: day.isToday ? 'white' : '#374151',
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-label': { px: 1 },
              }}
            />
          </Box>
        ))}
      </Box>

      {/* Date numbers */}
      <Box sx={{ display: 'flex', gap: 1, mb: 1.5, pl: '70px' }}>
        {validDays.map((day) => (
          <Box key={day.date} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: day.isToday ? 700 : 400,
                color: day.isToday ? university.colors.primary : '#9ca3af',
                fontSize: '0.8rem',
              }}
            >
              {day.dayNumber}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Heatmap grid */}
      <Box sx={{ position: 'relative' }}>
        {displaySlots.map((hour, slotIdx) => {
          const showLabel = sampledSlots.has(hour);
          return (
            <Box key={hour} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: '3px' }}>
              {/* Time label */}
              <Box sx={{ width: 65, textAlign: 'right', pr: 1, flexShrink: 0 }}>
                {showLabel && (
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.7rem' }}>
                    {hour}
                  </Typography>
                )}
              </Box>

              {/* Cells */}
              {validDays.map((day, dayIdx) => {
                const data = lookup.get(`${heatmapData.indexOf(day)}-${hour}`);
                const available = data?.available ?? 0;
                const total = data?.total ?? 0;
                const color = getAvailabilityColor(available, total);
                const isHovered = hoveredCell?.dayIdx === dayIdx && hoveredCell?.slotIdx === slotIdx;

                return (
                  <Box
                    key={day.date}
                    onClick={() => handleCellClick(day.date)}
                    sx={{
                      flex: 1,
                      height: 28,
                      bgcolor: color,
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.2)' : 'none',
                      border: day.isToday ? `2px solid ${university.colors.primary}` : '2px solid transparent',
                      '&:hover': { opacity: 0.9 },
                    }}
                    onMouseEnter={() => setHoveredCell({ dayIdx, slotIdx })}
                    onMouseLeave={() => setHoveredCell(null)}
                    data-testid={`heatmap-cell-${day.date}-${hour}`}
                  />
                );
              })}
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 3 }}>
        {[
          { color: '#22c55e', label: t('legend.plenty'), range: '≥60%' },
          { color: '#f59e0b', label: t('legend.moderate'), range: '30-60%' },
          { color: '#f97316', label: t('legend.few'), range: '<30%' },
          { color: '#ef4444', label: t('legend.full'), range: '0%' },
          { color: '#e5e7eb', label: t('legend.noData'), range: '' },
        ].map(({ color, label, range }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 14, height: 14, bgcolor: color, borderRadius: 0.5, border: '1px solid rgba(0,0,0,0.08)' }} />
            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.7rem' }}>
              {label}{range && ` (${range})`}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Hover detail */}
      {hovered && (
        <Box sx={{
          mt: 2,
          textAlign: 'center',
          py: 1.5,
          px: 3,
          bgcolor: '#f9fafb',
          borderRadius: 2,
          border: '1px solid #e5e7eb',
          maxWidth: 400,
          mx: 'auto',
        }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {hovered.day.dayName} {hovered.day.dayNumber} — {hovered.hour}
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280' }}>
            {hovered.available} / {hovered.total} {t('seatsAvailable')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af', mt: 0.5, display: 'block' }}>
            {t('clickToView')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
