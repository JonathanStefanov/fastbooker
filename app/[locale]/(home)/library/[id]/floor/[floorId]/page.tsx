"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { formatDate } from '@/lib/utils';
import { searchMultiField } from '@/lib/fuzzySearch';
import DateSelector from './DateSelector';
import SeatTile from './SeatTile';
import List from '@mui/material/List';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useFavorites } from '@/hooks/useFavorites';
import type { Seat } from '@/types';

async function fetchSeats(libraryId: string, floorId: string, date: string): Promise<Seat[]> {
  const res = await fetch(`/api/seats?library=${libraryId}&floor=${floorId}&date=${date}`);
  if (!res.ok) throw new Error('Failed to fetch seats');
  const data = await res.json();
  return data.flat(1);
}

export default function Floor({ params }: { params: { id: string; floorId: string } }) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'capacity'>('number');
  const [hideNoVacancies, setHideNoVacancies] = useState(false);
  const [hideReserved, setHideReserved] = useState(true);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { isFavorite } = useFavorites();

  const tFloor = useTranslations('floor');
  const tSort = useTranslations('sort');
  const tFilter = useTranslations('filter');
  const tCommon = useTranslations('common');

  const { data: seats, isLoading } = useQuery({
    queryKey: ['seats', params.id, params.floorId, selectedDate],
    queryFn: () => fetchSeats(params.id, params.floorId, selectedDate),
  });

  const handleDateChange = (date: string) => setSelectedDate(date);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => setSearch(event.target.value);
  const handleSortChange = (_: React.MouseEvent<HTMLElement>, newSortBy: string | null) => { if (newSortBy !== null) setSortBy(newSortBy as 'number' | 'capacity'); };
  const handleHideNoVacanciesChange = (event: React.ChangeEvent<HTMLInputElement>) => setHideNoVacancies(event.target.checked);
  const handleHideReservedChange = (event: React.ChangeEvent<HTMLInputElement>) => setHideReserved(event.target.checked);
  const handleFavoritesOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => setFavoritesOnly(event.target.checked);

  const hasVacancies = (seat: Seat) => seat.hours?.some(hour => hour.places_available > 0);
  const isReserved = (seat: Seat) => seat.description?.toLowerCase().includes('riservato');

  const getFilteredAndSortedSeats = (): Seat[] => {
    if (!seats) return [];
    let filtered = seats
      .filter((seat: Seat) => searchMultiField(seat as unknown as Record<string, unknown>, ['resource_name', 'description'], search))
      .filter((seat: Seat) => !hideNoVacancies || hasVacancies(seat))
      .filter((seat: Seat) => !hideReserved || !isReserved(seat))
      .filter((seat: Seat) => !favoritesOnly || isFavorite(String(seat.resource_id)));
    if (sortBy === 'capacity') {
      filtered = filtered.sort((a: Seat, b: Seat) => b.hours.filter(h => h.places_available > 0).length - a.hours.filter(h => h.places_available > 0).length);
    } else {
      filtered = filtered.sort((a: Seat, b: Seat) => (a.resource_name ?? '').localeCompare(b.resource_name ?? '', undefined, { numeric: true }));
    }
    // Favorites come first
    filtered = filtered.sort((a: Seat, b: Seat) => {
      const aFav = isFavorite(String(a.resource_id)) ? 0 : 1;
      const bFav = isFavorite(String(b.resource_id)) ? 0 : 1;
      return aFav - bFav;
    });
    return filtered;
  };

  const filteredAndSortedSeats = getFilteredAndSortedSeats();

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex justify-center"><DateSelector onDateChange={handleDateChange} /></div>
          <div className="flex justify-center"><div className="w-full max-w-[500px]"><TextField id="outlined-basic" label={tCommon('search')} variant="outlined" fullWidth value={search} onChange={handleSearchChange} placeholder={tCommon('searchPlaceholder')} /></div></div>
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>{tSort('label')}</Typography>
            <ToggleButtonGroup value={sortBy} exclusive onChange={handleSortChange} aria-label="sort seats" size="small">
              <ToggleButton value="number" aria-label="sort by number">{tSort('seatNumber')}</ToggleButton>
              <ToggleButton value="capacity" aria-label="sort by capacity">{tSort('availableSlots')}</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel control={<Switch checked={hideReserved} onChange={handleHideReservedChange} color="primary" />} label={tFilter('hideReserved')} />
            <FormControlLabel control={<Switch checked={hideNoVacancies} onChange={handleHideNoVacanciesChange} color="primary" />} label={tFilter('hideNoVacancies')} />
            <FormControlLabel control={<Switch checked={favoritesOnly} onChange={handleFavoritesOnlyChange} color="primary" data-testid="favorites-only-toggle" />} label={tFilter('favoritesOnly')} />
          </Box>
        </Box>
        <div className="flex flex-col items-center">
          {isLoading ? (
            <div className="mt-8"><CircularProgress /></div>
          ) : filteredAndSortedSeats.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}><Typography variant="h6" sx={{ color: '#6b7280' }}>{tFloor('noResults')}</Typography></Box>
          ) : (
            <List sx={{ width: '100%', maxWidth: 600 }}>
              {filteredAndSortedSeats.map((seat) => (
                <SeatTile
                  key={seat.id}
                  name={seat.resource_name}
                  description={seat.description}
                  hours={seat.hours}
                  id={String(seat.resource_id)}
                  date={selectedDate}
                  libraryId={params.id}
                  floorId={params.floorId}
                />
              ))}
            </List>
          )}
        </div>
      </div>
    </div>
  );
}
