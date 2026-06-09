import { describe, it, expect } from 'vitest';
import { getUniversity, getAllUniversities, getUniversitiesByCountry, DEFAULT_UNIVERSITY } from '@/lib/universities';

describe('getUniversity', () => {
  it('returns ULB for "ulb"', () => {
    const uni = getUniversity('ulb');
    expect(uni.id).toBe('ulb');
    expect(uni.shortName).toBe('ULB');
    expect(uni.emailDomain).toBe('ulb.be');
    expect(uni.country).toBe('BE');
    expect(uni.city).toBe('Bruxelles');
  });

  it('returns UniPD for "unipd"', () => {
    const uni = getUniversity('unipd');
    expect(uni.id).toBe('unipd');
    expect(uni.shortName).toBe('UniPD');
    expect(uni.emailDomain).toBe('unipd.it');
    expect(uni.country).toBe('IT');
  });

  it('returns EPFL for "epfl"', () => {
    const uni = getUniversity('epfl');
    expect(uni.id).toBe('epfl');
    expect(uni.shortName).toBe('EPFL');
    expect(uni.emailDomain).toBe('epfl.ch');
    expect(uni.country).toBe('CH');
  });

  it('returns UCLouvain for "uclouvain"', () => {
    const uni = getUniversity('uclouvain');
    expect(uni.id).toBe('uclouvain');
    expect(uni.shortName).toBe('UCLouvain');
    expect(uni.emailDomain).toBe('uclouvain.be');
    expect(uni.country).toBe('BE');
  });

  it('returns UNIL for "unil"', () => {
    const uni = getUniversity('unil');
    expect(uni.id).toBe('unil');
    expect(uni.shortName).toBe('UNIL');
    expect(uni.emailDomain).toBe('unil.ch');
  });

  it('returns UNIGE for "unige"', () => {
    const uni = getUniversity('unige');
    expect(uni.id).toBe('unige');
    expect(uni.shortName).toBe('UNIGE');
    expect(uni.emailDomain).toBe('unige.ch');
  });

  it('returns University of Luxembourg for "uniLux"', () => {
    const uni = getUniversity('uniLux');
    expect(uni.id).toBe('uniLux');
    expect(uni.shortName).toBe('Uni.lu');
    expect(uni.emailDomain).toBe('uni.lu');
    expect(uni.country).toBe('LU');
  });

  it('returns UniBo for "unibo"', () => {
    const uni = getUniversity('unibo');
    expect(uni.id).toBe('unibo');
    expect(uni.shortName).toBe('UniBo');
    expect(uni.emailDomain).toBe('unibo.it');
  });

  it('returns UV for "uv" (Valencia)', () => {
    const uni = getUniversity('uv');
    expect(uni.id).toBe('uv');
    expect(uni.shortName).toBe('UV');
    expect(uni.emailDomain).toBe('uv.es');
    expect(uni.country).toBe('ES');
  });

  it('falls back to ULB for unknown ID', () => {
    const uni = getUniversity('nonexistent');
    expect(uni.id).toBe('ulb');
  });

  it('every university has required fields', () => {
    const all = getAllUniversities();
    for (const uni of all) {
      expect(uni.id).toBeTruthy();
      expect(uni.name).toBeTruthy();
      expect(uni.shortName).toBeTruthy();
      expect(uni.searchQuery).toBeTruthy();
      expect(uni.emailDomain).toBeTruthy();
      expect(uni.country).toBeTruthy();
      expect(uni.colors.primary).toBeTruthy();
      expect(uni.colors.gradient).toBeTruthy();
    }
  });
});

describe('getAllUniversities', () => {
  it('returns 20+ universities', () => {
    const all = getAllUniversities();
    expect(all.length).toBeGreaterThanOrEqual(20);
  });

  it('includes all major universities', () => {
    const all = getAllUniversities();
    const ids = all.map(u => u.id);
    expect(ids).toContain('ulb');
    expect(ids).toContain('unipd');
    expect(ids).toContain('epfl');
    expect(ids).toContain('unil');
    expect(ids).toContain('unige');
    expect(ids).toContain('uclouvain');
    expect(ids).toContain('unamur');
    expect(ids).toContain('vub');
    expect(ids).toContain('ugent');
    expect(ids).toContain('unifr');
    expect(ids).toContain('unibo');
    expect(ids).toContain('unicatt');
    expect(ids).toContain('unimib');
    expect(ids).toContain('unipv');
    expect(ids).toContain('uniLux');
    expect(ids).toContain('uv');
  });

  it('no duplicate IDs', () => {
    const all = getAllUniversities();
    const ids = all.map(u => u.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getUniversitiesByCountry', () => {
  it('groups universities by country', () => {
    const grouped = getUniversitiesByCountry();
    expect(grouped.BE).toBeDefined();
    expect(grouped.CH).toBeDefined();
    expect(grouped.FR).toBeDefined();
    expect(grouped.IT).toBeDefined();
    expect(grouped.DE).toBeDefined();
    expect(grouped.LU).toBeDefined();
    expect(grouped.ES).toBeDefined();
  });

  it('Belgium has 5 universities', () => {
    const grouped = getUniversitiesByCountry();
    expect(grouped.BE.length).toBe(5);
  });

  it('Switzerland has 4 universities', () => {
    const grouped = getUniversitiesByCountry();
    expect(grouped.CH.length).toBe(4);
  });

  it('Italy has 7+ universities', () => {
    const grouped = getUniversitiesByCountry();
    expect(grouped.IT.length).toBeGreaterThanOrEqual(7);
  });

  it('total across all countries equals total universities', () => {
    const grouped = getUniversitiesByCountry();
    const totalFromGroups = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
    expect(totalFromGroups).toBe(getAllUniversities().length);
  });
});

describe('DEFAULT_UNIVERSITY', () => {
  it('is "ulb"', () => {
    expect(DEFAULT_UNIVERSITY).toBe('ulb');
  });

  it('is a valid university', () => {
    const uni = getUniversity(DEFAULT_UNIVERSITY);
    expect(uni.id).toBe(DEFAULT_UNIVERSITY);
  });
});
