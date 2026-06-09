'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { getUniversity, getAllUniversities, DEFAULT_UNIVERSITY } from '@/lib/universities';
import type { University } from '@/types';

interface UniversityContextType {
  university: University;
  universityId: string;
  selectUniversity: (id: string) => void;
  allUniversities: University[];
  showUniModal: boolean;
  openUniModal: () => void;
  closeUniModal: () => void;
  hasSelectedUniversity: boolean;
}

const UniversityContext = createContext<UniversityContextType | null>(null);

export function UniversityProvider({ children }: { children: ReactNode }) {
  const [universityId, setUniversityId] = useState(DEFAULT_UNIVERSITY);
  const [hasSelectedUniversity, setHasSelectedUniversity] = useState(false);
  const [showUniModal, setShowUniModal] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('selectedUniversity');
    if (saved) {
      const uni = getUniversity(saved);
      // Only accept if the returned university matches the requested ID (not a fallback)
      if (uni.id === saved) {
        setUniversityId(saved);
        setHasSelectedUniversity(true);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    const disclaimerAccepted = localStorage.getItem('disclaimer-accepted');
    const uniSaved = localStorage.getItem('selectedUniversity');

    if (disclaimerAccepted && !uniSaved) {
      setShowUniModal(true);
    }

    const handleDisclaimerAccepted = () => {
      if (!localStorage.getItem('selectedUniversity')) {
        setShowUniModal(true);
      }
    };
    window.addEventListener('disclaimerAccepted', handleDisclaimerAccepted);
    return () => window.removeEventListener('disclaimerAccepted', handleDisclaimerAccepted);
  }, [hydrated]);

  const selectUniversity = useCallback((id: string) => {
    setUniversityId(id);
    setHasSelectedUniversity(true);
    localStorage.setItem('selectedUniversity', id);
    document.cookie = `selectedUniversity=${id};path=/;max-age=31536000`;
  }, []);

  const openUniModal = useCallback(() => setShowUniModal(true), []);
  const closeUniModal = useCallback(() => setShowUniModal(false), []);

  const university = getUniversity(universityId);
  const allUniversities = getAllUniversities();

  return (
    <UniversityContext.Provider
      value={{
        university,
        universityId,
        selectUniversity,
        allUniversities,
        showUniModal,
        openUniModal,
        closeUniModal,
        hasSelectedUniversity,
      }}
    >
      {children}
    </UniversityContext.Provider>
  );
}

export function useUniversity(): UniversityContextType {
  const ctx = useContext(UniversityContext);
  if (!ctx) throw new Error('useUniversity must be used within UniversityProvider');
  return ctx;
}
