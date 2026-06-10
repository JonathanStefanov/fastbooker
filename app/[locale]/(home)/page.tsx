"use client";

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useUniversity } from '@/components/UniversityContext';
import LibraryTile from './LibraryTile';
import QuickRebook from '@/components/QuickRebook';
import CircularProgress from '@mui/material/CircularProgress';
import type { Library } from '@/types';

interface LibraryWithCount extends Library {
  seatCount?: number;
  current_forecast?: { occupancy?: number };
  closed?: boolean;
  poster_image?: string;
}

async function fetchLibraries(universityId: string): Promise<LibraryWithCount[]> {
  const res = await fetch(`/api/libraries?university=${universityId}`);
  if (!res.ok) throw new Error('Failed to fetch libraries');
  const data = await res.json();
  return (data || []).sort((a: LibraryWithCount, b: LibraryWithCount) => {
    if (a.seatCount !== undefined && b.seatCount !== undefined) {
      return b.seatCount - a.seatCount;
    }
    return (a.primary_name || '').localeCompare(b.primary_name || '');
  });
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const item = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } },
} as const;

export default function Home() {
  const { university, universityId } = useUniversity();
  const t = useTranslations('home');

  const { data: libraries, isLoading, isError } = useQuery({
    queryKey: ['libraries', universityId],
    queryFn: () => fetchLibraries(universityId),
    staleTime: 2 * 60 * 1000,
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('title')}</h1>
          <p className="text-lg text-gray-600">{t('subtitle')}</p>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center mt-8"><CircularProgress /></div>
      ) : isError ? (
        <div className="text-center mt-8"><p className="text-red-500 text-lg">{t('loadError')}</p></div>
      ) : libraries && libraries.length > 0 ? (
        <>
        <QuickRebook />
        <motion.div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto" variants={container} initial="hidden" animate="show">
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
        </>
      ) : null}
    </main>
  );
}
