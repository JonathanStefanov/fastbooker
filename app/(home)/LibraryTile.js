"use client";

import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Chip } from '@mui/material';

export default function LibraryTile({ name, image, id, closed, seatCount, occupancy}) {

  return (
    <Card sx={{ 
      width: 320, 
      height: '100%',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      borderRadius: '12px',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      }
    }}>
      <CardActionArea href={"/library/" + id}>
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={`${name} library`}
          sx={{ objectFit: 'cover' }}
        />
        <CardContent sx={{ minHeight: '80px' }}>
          <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
            {name}
          </Typography>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={closed ? "Closed" : "Open"}
              size="small"
              sx={{
                backgroundColor: closed ? '#ef4444' : '#22c55e',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem'
              }}
            />
            {occupancy !== null && occupancy !== undefined && !closed && (
              <Chip
                label={`${occupancy}% full`}
                size="small"
                sx={{
                  backgroundColor:
                    occupancy >= 80 ? '#ef4444' : // Red for high occupancy
                    occupancy >= 50 ? '#f59e0b' : // Orange for medium occupancy
                    '#22c55e', // Green for low occupancy
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            )}
            {seatCount !== undefined && seatCount > 0 && (
              <Chip
                label={`${seatCount} ${seatCount === 1 ? 'seat' : 'seats'}`}
                size="small"
                sx={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
            )}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}