import { useState } from 'react';
import { formatDate } from '@/lib/utils'
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function DateSelector({ onDateChange}) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));

  const handleChange = (event) => {
    setSelectedDate(event.target.value);
    onDateChange(event.target.value);
  };



  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl className='w-[200px]'>
        <InputLabel id="demo-simple-select-label">Date</InputLabel>
        <Select
          displayEmpty
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedDate}
          label="Date"
          onChange={handleChange}
        >
          <MenuItem key={1} value={formatDate(new Date())}>{`Today (${formatDate(new Date())})`}</MenuItem>
          <MenuItem key={2} value={formatDate(new Date(Date.now() + 86400000))}>{`Tomorrow (${formatDate(new Date(Date.now() + 86400000))})`}</MenuItem>
          <MenuItem key={3} value={formatDate(new Date(Date.now() + 172800000))}>{`Day after tomorrow (${formatDate(new Date(Date.now() + 172800000))})`}</MenuItem>
          <MenuItem key={4} value={formatDate(new Date(Date.now() + 259200000))}>{`In 3 days (${formatDate(new Date(Date.now() + 259200000))})`}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
