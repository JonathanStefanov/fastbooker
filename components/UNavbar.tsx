"use client";
import { IoIosArrowBack } from 'react-icons/io';
import { HiOutlineHome } from 'react-icons/hi';
import { FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Quicksand } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import { useUniversity } from './UniversityContext';
import { useEmail } from './EmailContext';
import { useTranslations } from 'next-intl';

const font = Quicksand({ subsets: ['latin'], weight: ['400', '600'] });

export default function UNavbar() {
  const { university } = useUniversity();
  const { email, openEmailModal } = useEmail();
  const t = useTranslations('navbar');

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <AppBar style={{
        position: 'relative',
        background: university.colors.gradient,
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
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
              onClick={() => { window.location.href = '/'; }}
            />
            <div className='mx-4'>
              <Typography variant="h6">
                <div className='flex items-center'>
                  <div className='px-3 py-1.5 rounded-lg font-bold mr-3 shadow-md text-white' style={{ backgroundColor: university.colors.primary }}>
                    {university.shortName}
                  </div>
                  <p className={twMerge(font.className, 'font-semibold text-lg')}>Fast Booker</p>
                </div>
              </Typography>
            </div>
          </Box>

          <button
            onClick={openEmailModal}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)' }}
          >
            <FiMail size={16} />
            <span className="hidden md:inline">{email ? email : t('setEmail')}</span>
            <span className="md:hidden">{email ? email.split('@')[0] : t('emailShort')}</span>
          </button>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
}
