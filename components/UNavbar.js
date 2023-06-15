"use client";
import { IoIosArrowBack} from 'react-icons/io';
import { HiOutlineHome } from 'react-icons/hi';
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import Image from 'next/image';
import ULBLogo from './ulblogo.png'
import { Quicksand } from 'next/font/google'
import { twMerge } from 'tailwind-merge'
// next js quicksant font
const font = Quicksand({ subsets: ['latin'], weight: ['400'] })

export default function UNavbar() {
  return (
    <AppBar style={{position: 'relative'}}>
      <Toolbar>
        <IoIosArrowBack size={30} className='mr-2' onClick={() => window.history.back()}/>
        <HiOutlineHome size={30} className='mr-2' onClick={() => window.location.href = '/'}/>
        <div className='mx-4'>
        <Typography variant="h6">
          <div className='flex h-full align-middle'>
          <Image
            src={ULBLogo}
            alt="ULB Logo"
            width={50}
            height={50}
            className='mt-2.5'
          />

          
          <p className={twMerge(font.className, 'mx-2')}>Fast Booker</p>
          </div>
          </Typography>
          </div>
      </Toolbar>
    </AppBar>
  );
}

