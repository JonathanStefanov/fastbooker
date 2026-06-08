import type { University } from '@/types';

const universities: Record<string, University> = {
  ulb: {
    id: 'ulb',
    name: 'Université Libre de Bruxelles',
    shortName: 'ULB',
    searchQuery: 'ulb',
    emailDomain: 'ulb.be',
    colors: {
      primary: '#1e3a5f',
      gradient: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)',
      chipBg: '#1e3a5f',
      chipText: '#ffffff',
      selectedDate: '#1e3a5f',
      hoverDate: '#15293f',
    },
    libraryOverrides: {
      'ulb-bss': { forceBookingAvailable: true },
      'ulb-bonn-hb': { forceBookingAvailable: false },
    },
  },
  unipd: {
    id: 'unipd',
    name: 'Università degli Studi di Padova',
    shortName: 'UniPD',
    searchQuery: 'Padova',
    emailDomain: 'unipd.it',
    colors: {
      primary: '#991b1b',
      gradient: 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
      chipBg: '#991b1b',
      chipText: '#ffffff',
      selectedDate: '#991b1b',
      hoverDate: '#7f1d1d',
    },
    libraryOverrides: {},
  },
};

export function getUniversity(id: string): University {
  return universities[id] || universities.ulb;
}

export function getAllUniversities(): University[] {
  return Object.values(universities);
}

export const DEFAULT_UNIVERSITY = 'ulb';

export default universities;
