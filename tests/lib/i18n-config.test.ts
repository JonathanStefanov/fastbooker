import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const MESSAGES_DIR = path.join(__dirname, '..', '..', 'messages');

describe('i18n configuration', () => {
  it('all message files are valid JSON', () => {
    const locales = ['en', 'it', 'fr'];
    for (const locale of locales) {
      const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
      expect(fs.existsSync(filePath)).toBe(true);
      const content = fs.readFileSync(filePath, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    }
  });

  it('all locales have the same top-level namespaces', () => {
    const en = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, 'en.json'), 'utf8'));
    const it = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, 'it.json'), 'utf8'));
    const fr = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, 'fr.json'), 'utf8'));

    const enKeys = Object.keys(en).sort();
    expect(Object.keys(it).sort()).toEqual(enKeys);
    expect(Object.keys(fr).sort()).toEqual(enKeys);
  });

  it('universityModal namespace exists in all locales', () => {
    const locales = ['en', 'it', 'fr'];
    for (const locale of locales) {
      const messages = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, `${locale}.json`), 'utf8'));
      expect(messages.universityModal).toBeDefined();
      expect(messages.universityModal.title).toBeTruthy();
      expect(messages.universityModal.subtitle).toBeTruthy();
      expect(messages.universityModal.searchPlaceholder).toBeTruthy();
      expect(messages.universityModal.noResults).toBeTruthy();
    }
  });

  it('navbar namespace has changeUniversity key in all locales', () => {
    const locales = ['en', 'it', 'fr'];
    for (const locale of locales) {
      const messages = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, `${locale}.json`), 'utf8'));
      expect(messages.navbar.changeUniversity).toBeTruthy();
    }
  });

  it('no empty string values in any locale', () => {
    const locales = ['en', 'it', 'fr'];
    const emptyKeys: string[] = [];

    function checkValues(obj: Record<string, unknown>, prefix: string) {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = `${prefix}.${key}`;
        if (typeof value === 'object' && value !== null) {
          checkValues(value as Record<string, unknown>, fullKey);
        } else if (value === '' || value === null || value === undefined) {
          emptyKeys.push(fullKey);
        }
      }
    }

    for (const locale of locales) {
      const messages = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, `${locale}.json`), 'utf8'));
      emptyKeys.length = 0;
      checkValues(messages, locale);
      expect(emptyKeys).toEqual([]);
    }
  });
});
