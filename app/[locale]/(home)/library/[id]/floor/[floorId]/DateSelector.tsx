"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from 'next-intl';
import { formatDate } from '@/lib/utils';
import { useUniversity } from '@/components/UniversityContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

const DAY_NAMES: Record<string, string[]> = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  it: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
  fr: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
};

interface DateSelectorProps {
  onDateChange: (date: string) => void;
}

export default function DateSelector({ onDateChange }: DateSelectorProps) {
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const { university } = useUniversity();
  const locale = useLocale();

  const getNext7Days = () => {
    const days = [];
    const today = new Date();
    const dayNames = DAY_NAMES[locale] || DAY_NAMES.en;

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        formattedDate: formatDate(date),
        isToday: i === 0,
      });
    }
    return days;
  };

  const days = getNext7Days();

  const handleDateClick = (formattedDate: string) => {
    setSelectedDate(formattedDate);
    onDateChange(formattedDate);
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 500, mb: 1.5, textAlign: 'center' }} />
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', flexWrap: 'wrap' }}>
        {days.map((day, index) => {
          const isSelected = selectedDate === day.formattedDate;
          return (
            <motion.div key={index} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }} animate={isSelected ? { scale: [1, 1.15, 1] } : {}} transition={{ type: 'spring', stiffness: 400, damping: 17 }}>
              <ButtonBase
                onClick={() => handleDateClick(day.formattedDate)}
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: 64, height: 64, borderRadius: '50%',
                  backgroundColor: isSelected ? university.colors.primary : '#ffffff',
                  color: isSelected ? '#ffffff' : '#1f2937',
                  border: isSelected ? `2px solid ${university.colors.primary}` : '2px solid #e5e7eb',
                  transition: 'all 0.2s ease',
                  '&:hover': { backgroundColor: isSelected ? university.colors.hoverDate : '#f3f4f6', borderColor: isSelected ? university.colors.hoverDate : '#d1d5db' },
                }}
              >
                <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.5px' }}>{day.dayName}</Typography>
                <Typography variant="h6" sx={{ fontSize: '1.25rem', fontWeight: 700, lineHeight: 1 }}>{day.dayNumber}</Typography>
                {day.isToday && <Box sx={{ position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: '50%', backgroundColor: isSelected ? '#ffffff' : university.colors.primary }} />}
              </ButtonBase>
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}
