"use client";

import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

export default function UNavbar() {
  return (
    <AppBar style={{position: 'relative'}}>
      <Toolbar>
        <Typography variant="h6">
          
          <p>Affluences Fast Booker</p>
          </Typography>
      </Toolbar>
    </AppBar>
  );
}

