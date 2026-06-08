"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getUniversity, getAllUniversities, DEFAULT_UNIVERSITY } from '@/lib/universities';
import type { University } from '@/types';

interface UniversityContextType {
  university: University;
  universityId: string;
  selectUniversity: (id: string) => void;
  allUniversities: University[];
}

const UniversityContext = createContext<UniversityContextType | null>(null);

export function UniversityProvider({ children }: { children: ReactNode }) {
  const [universityId, setUniversityId] = useState(DEFAULT_UNIVERSITY);

  useEffect(() => {
    const saved = localStorage.getItem('selectedUniversity');
    if (saved && getUniversity(saved)) {
      setUniversityId(saved);
    }
  }, []);

  const selectUniversity = (id: string) => {
    setUniversityId(id);
    localStorage.setItem('selectedUniversity', id);
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

export function useUniversity(): UniversityContextType {
  const ctx = useContext(UniversityContext);
  if (!ctx) throw new Error('useUniversity must be used within UniversityProvider');
  return ctx;
}
