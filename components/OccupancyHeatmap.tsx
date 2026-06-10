'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { OccupancyData, OccupancyForecast, OccupancyBuilding } from '@/app/api/occupancy/route';

function getOccupancyColor(pct: number | null): string {
  if (pct === null) return '#e5e7eb';
  if (pct >= 80) return '#ef4444';
  if (pct >= 60) return '#f97316';
  if (pct >= 40) return '#f59e0b';
  if (pct >= 20) return '#84cc16';
  return '#22c55e';
}

function getOccupancyTextColor(pct: number | null): string {
  if (pct === null) return '#9ca3af';
  if (pct >= 80) return '#ef4444';
  if (pct >= 60) return '#f97316';
  if (pct >= 40) return '#f59e0b';
  if (pct >= 20) return '#84cc16';
  return '#22c55e';
}

interface OccupancyHeatmapProps {
  libraryId: string;
}

export default function OccupancyHeatmap({ libraryId }: OccupancyHeatmapProps) {
  const [hoveredSlot, setHoveredSlot] = useState<number | null>(null);
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
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  if (error || !data) return null;

  const forecasts = data.forecasts;
  const buildings = data.buildings;

  if (forecasts.length === 0 && buildings.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <Typography variant="h6" sx={{ color: '#9ca3af' }}>{t('noData')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      {/* Site name */}
      {data.siteName && (
        <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: '#374151', fontWeight: 600 }}>
          {data.siteName}
        </Typography>
      )}

      {/* Hourly forecast grid */}
      {forecasts.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
            {t('todayForecast')}
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `repeat(${forecasts.length}, 1fr)`,
              gap: '4px',
            }}
          >
            {/* Bars */}
            {forecasts.map((f, i) => {
              const color = getOccupancyColor(f.occupancy);
              const isHovered = hoveredSlot === i;
              return (
                <Box
                  key={f.hour}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                  onMouseEnter={() => setHoveredSlot(i)}
                  onMouseLeave={() => setHoveredSlot(null)}
                >
                  {/* Bar */}
                  <Box
                    sx={{
                      width: '100%',
                      height: 120,
                      bgcolor: '#f3f4f6',
                      borderRadius: 1,
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: isHovered ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                    }}
                    data-testid={`occupancy-bar-${f.hour}`}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${f.occupancy ?? 0}%`,
                        bgcolor: color,
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.4s ease',
                      }}
                    />
                    {/* Percentage label inside bar */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          color: (f.occupancy ?? 0) >= 50 ? 'white' : '#374151',
                        }}
                      >
                        {f.occupancy}%
                      </Typography>
                    </Box>
                  </Box>
                  {/* Hour label */}
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#9ca3af',
                      fontSize: '0.6rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {f.hour}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Hover tooltip */}
      {hoveredSlot !== null && forecasts[hoveredSlot] && (
        <Box
          sx={{
            textAlign: 'center',
            py: 1.5,
            px: 3,
            bgcolor: '#f9fafb',
            borderRadius: 2,
            border: '1px solid #e5e7eb',
            maxWidth: 300,
            mx: 'auto',
            mb: 3,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {forecasts[hoveredSlot].hour}
          </Typography>
          <Typography variant="body2" sx={{ color: getOccupancyTextColor(forecasts[hoveredSlot].occupancy) }}>
            {forecasts[hoveredSlot].occupancy}% {t('occupancy')}
          </Typography>
        </Box>
      )}

      {/* Building breakdown */}
      {buildings.length > 0 && (
        <Box>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 1 }}>
            {t('buildings')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {buildings.map((b) => (
              <BuildingRow key={b.id} building={b} t={t} />
            ))}
          </Box>
        </Box>
      )}

      {/* Legend */}
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, flexWrap: 'wrap' }}>
        {[
          { color: '#22c55e', label: t('legend.quiet'), range: '<20%' },
          { color: '#84cc16', label: t('legend.light'), range: '20-40%' },
          { color: '#f59e0b', label: t('legend.moderate'), range: '40-60%' },
          { color: '#f97316', label: t('legend.busy'), range: '60-80%' },
          { color: '#ef4444', label: t('legend.full'), range: '≥80%' },
        ].map(({ color, label, range }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: color, borderRadius: 0.5 }} />
            <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.65rem' }}>
              {label} ({range})
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function BuildingRow({ building, t }: { building: OccupancyBuilding; t: ReturnType<typeof useTranslations> }) {
  const color = getOccupancyColor(building.occupancy);
  const pct = building.occupancy ?? 0;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        py: 1,
        px: 2,
        bgcolor: '#f9fafb',
        borderRadius: 1,
        border: '1px solid #e5e7eb',
      }}
    >
      <Typography variant="body2" sx={{ flex: 1, fontWeight: 500, fontSize: '0.85rem' }}>
        {building.name}
      </Typography>
      {!building.opened && (
        <Chip label={t('closed')} size="small" color="default" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
      )}
      {building.opened && building.occupancy !== null && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 80, height: 6, bgcolor: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ width: `${pct}%`, height: '100%', bgcolor: color, borderRadius: 3, transition: 'width 0.4s ease' }} />
          </Box>
          <Typography variant="caption" sx={{ fontWeight: 700, color, minWidth: 32, textAlign: 'right' }}>
            {pct}%
          </Typography>
        </Box>
      )}
    </Box>
  );
}
