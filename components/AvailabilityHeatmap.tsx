'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import type { HeatmapDay } from '@/app/api/heatmap/route';

function getAvailabilityColor(available: number, total: number): string {
  if (total === 0) return '#e5e7eb'; // gray — no data
  const ratio = available / total;
  if (ratio >= 0.6) return '#22c55e'; // green — lots of seats
  if (ratio >= 0.3) return '#f59e0b'; // yellow — moderate
  if (ratio > 0) return '#f97316';    // orange — few
  return '#ef4444';                    // red — full
}

function getAvailabilityLabel(available: number, total: number): string {
  if (total === 0) return 'No data';
  const ratio = available / total;
  if (ratio >= 0.6) return 'Plenty';
  if (ratio >= 0.3) return 'Moderate';
  if (ratio > 0) return 'Few seats';
  return 'Full';
}

interface AvailabilityHeatmapProps {
  libraryId: string;
}

export default function AvailabilityHeatmap({ libraryId }: AvailabilityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ day: number; slot: number } | null>(null);
  const t = useTranslations('heatmap');

  const { data: heatmapData, isLoading, error } = useQuery({
    queryKey: ['heatmap', libraryId],
    queryFn: async () => {
      const res = await fetch(`/api/heatmap?library=${libraryId}`);
      if (!res.ok) throw new Error('Failed to fetch heatmap');
      return res.json() as Promise<HeatmapDay[]>;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Collect all unique time slots across all days
  const allSlots = useMemo(() => {
    if (!heatmapData) return [];
    const slotSet = new Set<string>();
    for (const day of heatmapData) {
      for (const slot of day.slots) {
        slotSet.add(slot.hour);
      }
    }
    return Array.from(slotSet).sort();
  }, [heatmapData]);

  // Build a lookup: dayIndex × slotHour → {available, total}
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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error || !heatmapData) return null;

  // Skip days with no data (e.g., closed days)
  const validDays = heatmapData.filter(d => d.slots.length > 0);
  if (validDays.length === 0) return null;

  // Only show time slots that appear in at least one day
  const displaySlots = allSlots.filter(hour =>
    validDays.some(day => day.slots.some(s => s.hour === hour))
  );

  // Sample every Nth slot to avoid overcrowding (show ~12-16 labels)
  const step = Math.max(1, Math.floor(displaySlots.length / 14));
  const sampledSlots = displaySlots.filter((_, i) => i % step === 0 || i === displaySlots.length - 1);

  const today = new Date().toISOString().split('T')[0];

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
        {t('title')}
      </Typography>
      <Typography variant="body2" sx={{ color: '#6b7280', mb: 2, textAlign: 'center' }}>
        {t('subtitle')}
      </Typography>

      {/* Day columns */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 0.5, pl: '60px' }}>
        {validDays.map((day) => {
          const isToday = day.date === today;
          return (
            <Box key={day.date} sx={{ flex: 1, textAlign: 'center' }}>
              <Chip
                label={day.dayName}
                size="small"
                sx={{
                  fontWeight: isToday ? 700 : 500,
                  bgcolor: isToday ? 'primary.main' : 'transparent',
                  color: isToday ? 'white' : '#374151',
                  fontSize: '0.7rem',
                  height: 22,
                  '& .MuiChip-label': { px: 0.5 },
                }}
              />
            </Box>
          );
        })}
      </Box>

      {/* Date row */}
      <Box sx={{ display: 'flex', gap: 0.5, mb: 1, pl: '60px' }}>
        {validDays.map((day) => {
          const isToday = day.date === today;
          const dayNum = new Date(day.date + 'T12:00:00').getDate();
          return (
            <Box key={day.date} sx={{ flex: 1, textAlign: 'center' }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isToday ? 700 : 400,
                  color: isToday ? 'primary.main' : '#9ca3af',
                  fontSize: '0.7rem',
                }}
              >
                {dayNum}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* Heatmap grid */}
      <Box sx={{ position: 'relative' }}>
        {displaySlots.map((hour, slotIdx) => {
          const showLabel = sampledSlots.includes(hour);
          return (
            <Box key={hour} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
              {/* Time label */}
              <Box sx={{ width: 55, textAlign: 'right', pr: 1, flexShrink: 0 }}>
                {showLabel ? (
                  <Typography variant="caption" sx={{ color: '#9ca3af', fontSize: '0.65rem' }}>
                    {hour}
                  </Typography>
                ) : null}
              </Box>

              {/* Cells for each day */}
              {validDays.map((day, dayIdx) => {
                const data = lookup.get(`${heatmapData.indexOf(day)}-${hour}`);
                const available = data?.available ?? 0;
                const total = data?.total ?? 0;
                const color = getAvailabilityColor(available, total);
                const isHovered = hoveredCell?.day === dayIdx && hoveredCell?.slot === slotIdx;

                return (
                  <Box
                    key={day.date}
                    sx={{
                      flex: 1,
                      height: 14,
                      bgcolor: color,
                      borderRadius: 0.5,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: isHovered ? '0 0 8px rgba(0,0,0,0.3)' : 'none',
                      position: 'relative',
                    }}
                    onMouseEnter={() => setHoveredCell({ day: dayIdx, slot: slotIdx })}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`${day.dayName} ${hour}: ${available}/${total} seats free`}
                  />
                );
              })}
            </Box>
          );
        })}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
        {[
          { color: '#22c55e', label: t('legend.plenty') },
          { color: '#f59e0b', label: t('legend.moderate') },
          { color: '#f97316', label: t('legend.few') },
          { color: '#ef4444', label: t('legend.full') },
          { color: '#e5e7eb', label: t('legend.noData') },
        ].map(({ color, label }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: color, borderRadius: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.65rem' }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Hover tooltip */}
      {hoveredCell && (() => {
        const day = validDays[hoveredCell.day];
        const hour = displaySlots[hoveredCell.slot];
        const data = lookup.get(`${heatmapData.indexOf(day)}-${hour}`);
        const available = data?.available ?? 0;
        const total = data?.total ?? 0;
        const label = getAvailabilityLabel(available, total);
        return (
          <Box sx={{
            mt: 1.5,
            textAlign: 'center',
            py: 1,
            px: 2,
            bgcolor: '#f9fafb',
            borderRadius: 1,
            border: '1px solid #e5e7eb',
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {day.dayName} {hour} — {available} / {total} seats available
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              {label}
            </Typography>
          </Box>
        );
      })()}
    </Box>
  );
}
