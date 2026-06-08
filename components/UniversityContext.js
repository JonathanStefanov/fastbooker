"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { getUniversity, getAllUniversities, DEFAULT_UNIVERSITY } from '@/lib/universities';

const UniversityContext = createContext(null);

export function UniversityProvider({ children }) {
  const [universityId, setUniversityId] = useState(DEFAULT_UNIVERSITY);

  useEffect(() => {
    const saved = localStorage.getItem('selectedUniversity');
    if (saved && getUniversity(saved)) {
      setUniversityId(saved);
    }
  }, []);

  const selectUniversity = (id) => {
    setUniversityId(id);
    localStorage.setItem('selectedUniversity', id);
    // Also set a cookie so server components can read it
    document.cookie = `selectedUniversity=${id};path=/;max-age=31536000`;
  };

  const university = getUniversity(universityId);
  const allUniversities = getAllUniversities();

  return (
    <UniversityContext.Provider value={{ university, universityId, selectUniversity, allUniversities }}>
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity() {
  const ctx = useContext(UniversityContext);
  if (!ctx) throw new Error('useUniversity must be used within UniversityProvider');
  return ctx;
}
