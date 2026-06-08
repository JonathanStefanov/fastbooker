"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import List from '@mui/material/List';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { formatDate } from '@/lib/utils';
import { searchMultiField } from '@/lib/fuzzySearch';
import DateSelector from '../floor/[floorId]/DateSelector';
import SeatTile from '../floor/[floorId]/SeatTile';
import getAllSeats from '@/lib/getAllSeats';

async function fetchAllSeats(libraryId, date) {
  return getAllSeats(libraryId, date);
}

export default function AllSeats({ params }) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [search, setSearch] = useState('');
  const [hideNoVacancies, setHideNoVacancies] = useState(false);
  const [sortBy, setSortBy] = useState('number');
  const [hideReserved, setHideReserved] = useState(true);

  const { data: seats, isLoading } = useQuery({
    queryKey: ['allSeats', params.id, selectedDate],
    queryFn: () => fetchAllSeats(params.id, selectedDate),
  });

  const handleDateChange = (date) => setSelectedDate(date);
  const handleSearchChange = (event) => setSearch(event.target.value);
  const handleHideNoVacanciesChange = (event) => setHideNoVacancies(event.target.checked);
  const handleHideReservedChange = (event) => setHideReserved(event.target.checked);
  const handleSortChange = (event, newSortBy) => { if (newSortBy !== null) setSortBy(newSortBy); };

  const hasVacancies = (seat) => seat.hours && seat.hours.some(hour => hour.places_available > 0);
  const isReserved = (seat) => seat.description && seat.description.toLowerCase().includes('riservato');

  const getFilteredAndSortedSeats = () => {
    if (!seats) return [];

    let filtered = seats
      .filter((seat) => searchMultiField(seat, ['resource_name', 'description', 'floor_name'], search))
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">All Available Seats</h1>
          <p className="text-lg text-gray-600">Viewing seats across all rooms</p>
        </div>

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <List sx={{ width: '100%', maxWidth: '900px', p: 0 }}>
                <AnimatePresence>
                  {filteredAndSortedSeats.map((seat, i) => (
                    <motion.div
                      key={`${seat.resource_id}-${selectedDate}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.4), type: 'spring', stiffness: 300, damping: 24 }}
                    >
                      <SeatTile
                        id={seat.resource_id}
                        name={seat.resource_name}
                        description={`${seat.floor_name} - ${seat.description}`}
                        date={selectedDate}
                        hours={seat.hours}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </List>
            </motion.div>
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
