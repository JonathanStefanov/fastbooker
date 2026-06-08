"use client";

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useUniversity } from '@/components/UniversityContext';
import LibraryTile from './LibraryTile';
import UniversitySelector from '@/components/UniversitySelector';
import CircularProgress from '@mui/material/CircularProgress';

async function fetchLibraries(universityId) {
  const res = await fetch(`/api/libraries?university=${universityId}`);
  if (!res.ok) throw new Error('Failed to fetch libraries');
  const data = await res.json();
  return (data || []).sort((a, b) => {
    if (a.seatCount !== undefined && b.seatCount !== undefined) {
      return b.seatCount - a.seatCount;
    }
    return (a.primary_name || '').localeCompare(b.primary_name || '');
  });
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 22 } },
};

export default function Home() {
  const { university, universityId } = useUniversity();

  const { data: libraries, isLoading, isError } = useQuery({
    queryKey: ['libraries', universityId],
    queryFn: () => fetchLibraries(universityId),
    staleTime: 2 * 60 * 1000, // 2min — library list rarely changes
  });

  return (
    <main className="py-8 px-4">
      <motion.div
        className="flex justify-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to FastBooker</h1>
          <p className="text-lg text-gray-600">Book your seat in one go!</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <UniversitySelector />
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center mt-8">
          <CircularProgress />
        </div>
      ) : isError ? (
        <div className="text-center mt-8">
          <p className="text-red-500 text-lg">Failed to load libraries. Please try again.</p>
        </div>
      ) : libraries && libraries.length > 0 ? (
        <motion.div
          className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {libraries
            .filter(lib => lib.booking_available !== false)
            .map((library, i) => (
              <motion.div key={library.id || i} variants={item}>
                <LibraryTile
                  name={library.primary_name}
                  image={library.poster_image}
                  id={library.id}
                  closed={library.closed}
                  seatCount={library.seatCount}
                  occupancy={library.current_forecast?.occupancy}
                />
              </motion.div>
            ))}
        </motion.div>
      ) : (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-lg">No libraries found for {university.shortName}.</p>
        </div>
      )}
    </main>
  );
}
