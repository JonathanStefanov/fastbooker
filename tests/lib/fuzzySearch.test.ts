import { describe, it, expect } from 'vitest';
import { simpleSearch, searchMultiField } from '@/lib/fuzzySearch';

describe('simpleSearch', () => {
  it('returns true for empty query', () => {
    expect(simpleSearch('hello', '')).toBe(true);
    expect(simpleSearch('hello', '  ')).toBe(true);
  });

  it('returns false for empty text', () => {
    expect(simpleSearch('', 'hello')).toBe(false);
    expect(simpleSearch(null as unknown as string, 'hello')).toBe(false);
  });

  it('matches single term', () => {
    expect(simpleSearch('Hello World', 'hello')).toBe(true);
    expect(simpleSearch('Hello World', 'world')).toBe(true);
    expect(simpleSearch('Hello World', 'xyz')).toBe(false);
  });

  it('matches multiple terms (all must be present)', () => {
    expect(simpleSearch('E 1 16', 'E 1')).toBe(true);
    expect(simpleSearch('E 1 16', 'E 1 16')).toBe(true);
    expect(simpleSearch('E 1 16', 'E 2')).toBe(false);
  });

  it('is case insensitive', () => {
    expect(simpleSearch('HELLO', 'hello')).toBe(true);
    expect(simpleSearch('hello', 'HELLO')).toBe(true);
  });
});

describe('searchMultiField', () => {
  const item = {
    resource_name: 'E 1 16',
    description: 'Salle d\'étude',
    floor_name: 'Bâtiment NB',
  };

  it('returns true for empty query', () => {
    expect(searchMultiField(item, ['resource_name', 'description'], '')).toBe(true);
  });

  it('matches across fields', () => {
    expect(searchMultiField(item, ['resource_name', 'description'], 'étude')).toBe(true);
    expect(searchMultiField(item, ['resource_name', 'floor_name'], 'NB')).toBe(true);
  });

  it('matches multi-term across fields', () => {
    expect(searchMultiField(item, ['resource_name', 'floor_name'], 'E NB')).toBe(true);
  });

  it('returns false when no match', () => {
    expect(searchMultiField(item, ['resource_name', 'description'], 'xyz')).toBe(false);
  });
});
