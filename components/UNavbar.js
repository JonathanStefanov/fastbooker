"use client";
import { IoIosArrowBack} from 'react-icons/io';
import { HiOutlineHome } from 'react-icons/hi';
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, TextField, Box } from '@mui/material';
import { Quicksand } from 'next/font/google'
import { twMerge } from 'tailwind-merge'
import { useUniversity } from './UniversityContext';

const font = Quicksand({ subsets: ['latin'], weight: ['400', '600'] })

export default function UNavbar() {
  const [email, setEmail] = useState('');
  const { university } = useUniversity();

  // Load email from localStorage on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  // Save email to localStorage and dispatch event whenever it changes
  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    localStorage.setItem('userEmail', newEmail);

    // Dispatch custom event so other components can react to email changes
    window.dispatchEvent(new CustomEvent('emailChanged', { detail: newEmail }));
  };

  return (
    <AppBar style={{
      position: 'relative', 
      background: university.colors.gradient,
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IoIosArrowBack
            size={28}
            className='mr-3 cursor-pointer transition-transform hover:scale-110'
            onClick={() => window.history.back()}
          />
          <HiOutlineHome
            size={28}
            className='mr-3 cursor-pointer transition-transform hover:scale-110'
            onClick={() => window.location.href = '/'}
          />
          <div className='mx-4'>
            <Typography variant="h6">
              <div className='flex items-center'>
                <div
                  className='px-3 py-1.5 rounded-lg font-bold mr-3 shadow-md text-white'
                  style={{ backgroundColor: university.colors.primary }}
                >
                  {university.shortName}
                </div>
                <p className={twMerge(font.className, 'font-semibold text-lg')}>Fast Booker</p>
              </div>
            </Typography>
          </div>
        </Box>

        {/* Email input on the right */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <TextField
            label={`${university.shortName} Email`}
            variant="outlined"
            size="small"
            value={email}
            onChange={handleEmailChange}
            placeholder={`@${university.emailDomain}`}
            sx={{
              backgroundColor: 'white',
              borderRadius: '8px',
              minWidth: '250px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
              }
            }}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
