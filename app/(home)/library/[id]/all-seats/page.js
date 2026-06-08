"use client";

import { useState, useEffect } from 'react';
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

export default function AllSeats({ params }) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [seats, setSeats] = useState(null);
  const [email, setEmail] = useState('');
  const [search, setSearch] = useState('');
  const [hideNoVacancies, setHideNoVacancies] = useState(false);
  const [sortBy, setSortBy] = useState('number'); // 'number' or 'capacity'
  const [hideReserved, setHideReserved] = useState(true); // Default to ON

  // Load email from localStorage and listen for changes
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }

    const handleEmailChange = (event) => {
      setEmail(event.detail);
    };

    window.addEventListener('emailChanged', handleEmailChange);
    return () => window.removeEventListener('emailChanged', handleEmailChange);
  }, []);

  useEffect(() => {
    getAllSeats(params.id, selectedDate).then((data) => {
      setSeats(data);
      console.log(data);
    });
  }, [params.id, selectedDate]);

  const handleDateChange = (date) => {
    setSeats(null);
    setSelectedDate(date);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleHideNoVacanciesChange = (event) => {
    setHideNoVacancies(event.target.checked);
  };

  const handleHideReservedChange = (event) => {
    setHideReserved(event.target.checked);
  };

  const handleSortChange = (event, newSortBy) => {
    if (newSortBy !== null) {
      setSortBy(newSortBy);
    }
  };

  const hasVacancies = (seat) => {
    return seat.hours && seat.hours.some(hour => hour.places_available > 0);
  };

  const isReserved = (seat) => {
    return seat.description && seat.description.toLowerCase().includes('riservato');
  };

  // Filter and sort seats
  const getFilteredAndSortedSeats = () => {
    if (!seats) return [];

    let filtered = seats
      .filter((seat) =>
        searchMultiField(seat, ['resource_name', 'description', 'floor_name'], search)
      )
      .filter((seat) => !hideNoVacancies || hasVacancies(seat))
      .filter((seat) => !hideReserved || !isReserved(seat));

    if (sortBy === 'capacity') {
      // Sort by number of available slots (descending)
      filtered = filtered.sort((a, b) => {
        const aAvailable = a.hours.filter(h => h.places_available > 0).length;
        const bAvailable = b.hours.filter(h => h.places_available > 0).length;
        return bAvailable - aAvailable;
      });
    } else {
      // Sort by seat number/name (ascending)
      filtered = filtered.sort((a, b) => {
        return a.resource_name.localeCompare(b.resource_name, undefined, { numeric: true });
      });
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
          {/* Date Selector - Full Width */}
          <div className="flex justify-center">
            <DateSelector onDateChange={handleDateChange} />
          </div>

          {/* Search Bar */}
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

        {/* Controls: Sort Toggle and Hide No Vacancies */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, gap: 4, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500 }}>
              Sort by:
            </Typography>
            <ToggleButtonGroup
              value={sortBy}
              exclusive
              onChange={handleSortChange}
              aria-label="sort seats"
              size="small"
            >
              <ToggleButton value="number" aria-label="sort by number">
                Seat Number
              </ToggleButton>
              <ToggleButton value="capacity" aria-label="sort by capacity">
                Available Slots
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={hideReserved}
                  onChange={handleHideReservedChange}
                  color="primary"
                />
              }
              label="Hide reserved seats"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={hideNoVacancies}
                  onChange={handleHideNoVacanciesChange}
                  color="primary"
                />
              }
              label="Hide seats without vacancies"
            />
          </Box>
        </Box>

        <div className="flex flex-col items-center">
          {seats ? (
            <List sx={{ width: '100%', maxWidth: '900px', p: 0 }}>
              {filteredAndSortedSeats.length > 0 ? (
                filteredAndSortedSeats.map((seat, i) => (
                  <SeatTile
                    key={i}
                    id={seat.resource_id}
                    name={seat.resource_name}
                    description={`${seat.floor_name} - ${seat.description}`}
                    date={selectedDate}
                    hours={seat.hours}
                    email={email}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ color: '#6b7280' }}>
                    No seats found matching your criteria.
                  </Typography>
                </Box>
              )}
            </List>
          ) : (
            <div className="mt-8">
              <CircularProgress />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
