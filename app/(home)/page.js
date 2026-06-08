"use client";

import { useQuery } from '@tanstack/react-query';
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

export default function Home() {
  const { university, universityId } = useUniversity();

  const { data: libraries, isLoading, isError } = useQuery({
    queryKey: ['libraries', universityId],
    queryFn: () => fetchLibraries(universityId),
  });

  return (
    <main className="py-8 px-4">
      <div className="flex justify-center mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to FastBooker</h1>
          <p className="text-lg text-gray-600">Book your seat in one go!</p>
        </div>
      </div>

      <UniversitySelector />

      {isLoading ? (
        <div className="flex justify-center mt-8">
          <CircularProgress />
        </div>
      ) : isError ? (
        <div className="text-center mt-8">
          <p className="text-red-500 text-lg">Failed to load libraries. Please try again.</p>
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
