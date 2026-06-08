"use client";

import { motion } from 'framer-motion';
import FloorTile from '@/components/FloorTile';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function RoomList({ floors, libraryId }) {
  return (
    <motion.div
      className="flex justify-center max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <Paper
        elevation={2}
        sx={{
          width: '100%',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
      >
        <List sx={{ py: 0 }} component={motion.ul} variants={container} initial="hidden" animate="show">
          {floors.map((floor, i) => (
            <motion.div key={i} variants={item}>
              <FloorTile
                name={floor.localized_description}
                image={floor.image}
                libraryId={libraryId}
                id={floor.resource_type}
              />
            </motion.div>
          ))}
        </List>
      </Paper>
    </motion.div>
  );
}
