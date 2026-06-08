/**
 * University configurations for FastBooker.
 * Each university defines its Affluences API search query, branding, and email domain.
 */
const universities = {
  ulb: {
    id: 'ulb',
    name: 'Université Libre de Bruxelles',
    shortName: 'ULB',
    searchQuery: 'ulb',
    emailDomain: 'ulb.be',
    colors: {
      primary: '#1e3a5f',      // ULB navy
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
      primary: '#991b1b',      // UniPD red
      gradient: 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)',
      chipBg: '#991b1b',
      chipText: '#ffffff',
      selectedDate: '#991b1b',
      hoverDate: '#7f1d1d',
    },
    libraryOverrides: {},
  },
};

/**
 * Get a university config by ID.
 * Falls back to 'ulb' if the ID is not found.
 */
export function getUniversity(id) {
  return universities[id] || universities.ulb;
}

/**
 * Get all available universities as an array.
 */
export function getAllUniversities() {
  return Object.values(universities);
}

/**
 * Default university ID.
 */
export const DEFAULT_UNIVERSITY = 'ulb';

export default universities;
