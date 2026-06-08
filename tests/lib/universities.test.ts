import { describe, it, expect } from 'vitest';
import { getUniversity, getAllUniversities, DEFAULT_UNIVERSITY } from '@/lib/universities';

describe('getUniversity', () => {
  it('returns ULB for "ulb"', () => {
    const uni = getUniversity('ulb');
    expect(uni.id).toBe('ulb');
    expect(uni.shortName).toBe('ULB');
    expect(uni.emailDomain).toBe('ulb.be');
  });

  it('returns UniPD for "unipd"', () => {
    const uni = getUniversity('unipd');
    expect(uni.id).toBe('unipd');
    expect(uni.shortName).toBe('UniPD');
    expect(uni.emailDomain).toBe('unipd.it');
  });

  it('falls back to ULB for unknown ID', () => {
    const uni = getUniversity('nonexistent');
    expect(uni.id).toBe('ulb');
  });
});

describe('getAllUniversities', () => {
  it('returns at least 2 universities', () => {
    const all = getAllUniversities();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it('includes ULB and UniPD', () => {
    const all = getAllUniversities();
    const ids = all.map(u => u.id);
    expect(ids).toContain('ulb');
    expect(ids).toContain('unipd');
  });
});

describe('DEFAULT_UNIVERSITY', () => {
  it('is "ulb"', () => {
    expect(DEFAULT_UNIVERSITY).toBe('ulb');
  });
});
