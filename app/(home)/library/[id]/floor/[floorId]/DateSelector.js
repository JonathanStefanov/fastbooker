"use client";

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { useUniversity } from '@/components/UniversityContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

export default function DateSelector({ onDateChange }) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const { university } = useUniversity();

  // Generate next 7 days starting from today
  const getNext7Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      const dayNumber = date.getDate();
      const formattedDate = formatDate(date);

      days.push({
        dayName,
        dayNumber,
        formattedDate,
        isToday: i === 0,
        fullDate: date
      });
    }

    return days;
  };

  const days = getNext7Days();

  const handleDateClick = (formattedDate) => {
    setSelectedDate(formattedDate);
    onDateChange(formattedDate);
  };

  return (
    <Box>
      <Typography
        variant="body2"
        sx={{
          color: '#6b7280',
          fontWeight: 500,
          mb: 1.5,
          textAlign: 'center'
        }}
      >
      </Typography>
      <Box sx={{
        display: 'flex',
        gap: 1.5,
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {days.map((day, index) => {
          const isSelected = selectedDate === day.formattedDate;
          return (
            <ButtonBase
              key={index}
              onClick={() => handleDateClick(day.formattedDate)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: isSelected ? university.colors.primary : '#ffffff',
                color: isSelected ? '#ffffff' : '#1f2937',
                border: isSelected ? `2px solid ${university.colors.primary}` : '2px solid #e5e7eb',
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: isSelected ? university.colors.hoverDate : '#f3f4f6',
                  transform: 'scale(1.05)',
                  borderColor: isSelected ? university.colors.hoverDate : '#d1d5db',
                }
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px'
                }}
              >
                {day.dayName}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  lineHeight: 1
                }}
              >
                {day.dayNumber}
              </Typography>
              {day.isToday && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    backgroundColor: isSelected ? '#ffffff' : university.colors.primary,
                  }}
                />
              )}
            </ButtonBase>
          );
        })}
      </Box>
    </Box>
  );
}
