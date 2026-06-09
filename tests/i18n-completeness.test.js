const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const SUPPORTED_LOCALES = ['en', 'it', 'fr'];

function loadLocale(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  if (!fs.existsSync(filePath)) throw new Error(`Missing file: ${filePath}`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function flattenKeys(obj, prefix = '') {
  const keys = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

function run() {
  console.log('🔍 i18n Key Completeness Test\n');
  const locales = {};
  for (const locale of SUPPORTED_LOCALES) {
    locales[locale] = loadLocale(locale);
    console.log(`  ✅ Loaded ${locale}.json`);
  }

  const referenceKeys = flattenKeys(locales[SUPPORTED_LOCALES[0]]);
  console.log(`\n  📊 Reference: ${SUPPORTED_LOCALES[0]}.json has ${referenceKeys.length} keys\n`);

  let totalChecks = 0;
  let passed = true;

  for (let i = 1; i < SUPPORTED_LOCALES.length; i++) {
    const locale = SUPPORTED_LOCALES[i];
    const localeKeys = flattenKeys(locales[locale]);
    const missing = referenceKeys.filter(k => !localeKeys.includes(k));
    totalChecks += referenceKeys.length;
    if (missing.length > 0) {
      console.log(`  ❌ ${locale}: missing ${missing.length} keys: ${missing.join(', ')}`);
      passed = false;
    } else {
      console.log(`  ✅ ${locale}: all ${referenceKeys.length} keys present`);
    }
  }

  // Check for empty values
  for (const locale of SUPPORTED_LOCALES) {
    const flat = {};
    function walk(obj, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          walk(value, fullKey);
        } else {
          flat[fullKey] = value;
        }
      }
    }
    walk(locales[locale]);
    for (const [key, value] of Object.entries(flat)) {
      totalChecks++;
      if (value === '' || value === null || value === undefined) {
        console.log(`  ⚠️  ${locale}: empty value for "${key}"`);
      }
    }
  }

  console.log('─'.repeat(50));
  if (passed) {
    console.log(`\n  ✅ All tests passed! (${totalChecks} checks across ${SUPPORTED_LOCALES.length} locales)`);
  } else {
    console.log(`\n  ❌ Some tests failed.`);
    process.exit(1);
  }
}

run();
