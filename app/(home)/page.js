"use client";

import { useState, useEffect } from 'react';
import { useUniversity } from '@/components/UniversityContext';
import LibraryTile from './LibraryTile';
import UniversitySelector from '@/components/UniversitySelector';
import CircularProgress from '@mui/material/CircularProgress';

export default function Home() {
  const { university, universityId } = useUniversity();
  const [libraries, setLibraries] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setLibraries(null);

    fetch(`/api/libraries?university=${universityId}`)
      .then(res => res.json())
      .then(data => {
        // Sort by seat count descending (if available), otherwise alphabetically
        const sorted = (data || []).sort((a, b) => {
          if (a.seatCount !== undefined && b.seatCount !== undefined) {
            return b.seatCount - a.seatCount;
          }
          return (a.primary_name || '').localeCompare(b.primary_name || '');
        });
        setLibraries(sorted);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch libraries:', err);
        setLoading(false);
      });
  }, [universityId]);

  return (
    <main className="py-8 px-4">
      <div className="flex justify-center mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to FastBooker</h1>
          <p className="text-lg text-gray-600">Book your seat in one go!</p>
        </div>
      </div>

      <UniversitySelector />

      {loading ? (
        <div className="flex justify-center mt-8">
          <CircularProgress />
        </div>
      ) : libraries && libraries.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {libraries
            .filter(lib => lib.booking_available !== false)
            .map((library, i) => (
              <div key={library.id || i}>
                <LibraryTile
                  name={library.primary_name}
                  image={library.poster_image}
                  id={library.id}
                  closed={library.closed}
                  seatCount={library.seatCount}
                  occupancy={library.current_forecast?.occupancy}
                />
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center mt-8">
          <p className="text-gray-500 text-lg">No libraries found for {university.shortName}.</p>
        </div>
      )}
    </main>
  );
}
