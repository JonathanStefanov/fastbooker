"use client";

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import TextField from '@mui/material/TextField';
import getSeats from '@/lib/getSeats';
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

async function fetchSeats(libraryId, floorId, date) {
  const data = await getSeats(libraryId, floorId, date);
  return data.flat(1);
}

export default function Floor({ params }) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('number');
  const [hideNoVacancies, setHideNoVacancies] = useState(false);
  const [hideReserved, setHideReserved] = useState(true);

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) setEmail(savedEmail);

    const handleEmailChange = (event) => setEmail(event.detail);
    window.addEventListener('emailChanged', handleEmailChange);
    return () => window.removeEventListener('emailChanged', handleEmailChange);
  }, []);

  const { data: seats, isLoading } = useQuery({
    queryKey: ['seats', params.id, params.floorId, selectedDate],
    queryFn: () => fetchSeats(params.id, params.floorId, selectedDate),
  });

  const handleDateChange = (date) => setSelectedDate(date);
  const handleSearchChange = (event) => setSearch(event.target.value);
  const handleSortChange = (event, newSortBy) => { if (newSortBy !== null) setSortBy(newSortBy); };
  const handleHideNoVacanciesChange = (event) => setHideNoVacancies(event.target.checked);
  const handleHideReservedChange = (event) => setHideReserved(event.target.checked);

  const hasVacancies = (seat) => seat.hours && seat.hours.some(hour => hour.places_available > 0);
  const isReserved = (seat) => seat.description && seat.description.toLowerCase().includes('riservato');

  const getFilteredAndSortedSeats = () => {
    if (!seats) return [];

    let filtered = seats
      .filter((seat) => searchMultiField(seat, ['resource_name', 'description'], search))
      .filter((seat) => !hideNoVacancies || hasVacancies(seat))
      .filter((seat) => !hideReserved || !isReserved(seat));

    if (sortBy === 'capacity') {
      filtered = filtered.sort((a, b) => {
        const aAvailable = a.hours.filter(h => h.places_available > 0).length;
        const bAvailable = b.hours.filter(h => h.places_available > 0).length;
        return bAvailable - aAvailable;
      });
    } else {
      filtered = filtered.sort((a, b) => a.resource_name.localeCompare(b.resource_name, undefined, { numeric: true }));
    }

    return filtered;
  };

  const filteredAndSortedSeats = getFilteredAndSortedSeats();

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex justify-center">
            <DateSelector onDateChange={handleDateChange} />
          </div>
          <div className="flex justify-center">
            <div className="w-full max-w-[500px]">
              <TextField
                id="outlined-basic"
                label="Search"
                variant="outlined"
                fullWidth
                value={search}
                onChange={handleSearchChange}
                placeholder="e.g., E 1 16 (all terms must match)"
              />
            </div>
          </div>
        </div>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>Sort by:</Typography>
            <ToggleButtonGroup value={sortBy} exclusive onChange={handleSortChange} aria-label="sort seats" size="small">
              <ToggleButton value="number" aria-label="sort by number">Seat Number</ToggleButton>
              <ToggleButton value="capacity" aria-label="sort by capacity">Available Slots</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel control={<Switch checked={hideReserved} onChange={handleHideReservedChange} color="primary" />} label="Hide reserved seats" />
            <FormControlLabel control={<Switch checked={hideNoVacancies} onChange={handleHideNoVacanciesChange} color="primary" />} label="Hide seats without vacancies" />
          </Box>
        </Box>

        <div className="flex flex-col items-center">
          {isLoading ? (
            <div className="mt-8"><CircularProgress /></div>
          ) : filteredAndSortedSeats.length > 0 ? (
            <List sx={{ width: '100%', maxWidth: '900px', p: 0 }}>
              {filteredAndSortedSeats.map((seat, i) => (
                <SeatTile
                  key={i}
                  id={seat.resource_id}
                  name={seat.resource_name}
                  description={seat.description}
                  date={selectedDate}
                  hours={seat.hours}
                  email={email}
                />
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" sx={{ color: '#6b7280' }}>No seats found matching your criteria.</Typography>
            </Box>
          )}
        </div>
      </div>
    </div>
  );
}
