"use client";

import * as React from 'react';
import { motion } from 'framer-motion';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function FloorTile({ name, image, id, libraryId }) {
  return (
    <ListItem
      disablePadding
      sx={{
        borderBottom: '1px solid #e5e7eb',
        '&:last-child': {
          borderBottom: 'none'
        }
      }}
    >
      <ListItemButton
        href={"/library/" + libraryId + "/floor/" + id}
        component={motion.a}
        whileHover={{ x: 4, backgroundColor: '#f3f4f6' }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        sx={{
          py: 2,
          px: 3,
          display: 'flex',
        }}
      >
        <ListItemAvatar>
          <Avatar
            src={image}
            alt={`${name} room`}
            sx={{
              width: 56,
              height: 56,
              marginRight: 2
            }}
            variant="rounded"
          />
        </ListItemAvatar>
        <ListItemText
          primary={name}
          primaryTypographyProps={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#1f2937'
          }}
        />
        <motion.div
          animate={{ x: 0 }}
          whileHover={{ x: 3 }}
          transition={{ duration: 0.15 }}
        >
          <ChevronRightIcon sx={{ color: '#9ca3af' }} />
        </motion.div>
      </ListItemButton>
    </ListItem>
  );
}
