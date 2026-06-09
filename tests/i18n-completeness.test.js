const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '..', 'messages');
const SUPPORTED_LOCALES = ['en', 'it', 'fr'];

function loadMessages(locale) {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  if (!fs.existsSync(filePath)) throw new Error(`Missing message file: ${filePath}`);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
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

function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((o, k) => o?.[k], obj);
}

let passed = 0;
let failed = 0;
const errors = [];

function assert(condition, message) {
  if (condition) { passed++; } else { failed++; errors.push(message); }
}

console.log('🔍 i18n Key Completeness Test\n');

const messages = {};
for (const locale of SUPPORTED_LOCALES) {
  try {
    messages[locale] = loadMessages(locale);
    console.log(`  ✅ Loaded ${locale}.json`);
  } catch (err) {
    console.log(`  ❌ Failed to load ${locale}.json: ${err.message}`);
    process.exit(1);
  }
}

const referenceKeys = flattenKeys(messages.en);
console.log(`\n  📊 Reference: en.json has ${referenceKeys.length} keys\n`);

for (const locale of SUPPORTED_LOCALES) {
  if (locale === 'en') continue;
  const localeKeys = flattenKeys(messages[locale]);
  const localeKeySet = new Set(localeKeys);
  const missingKeys = referenceKeys.filter(k => !localeKeySet.has(k));
  for (const key of missingKeys) assert(false, `[${locale}] Missing key: ${key}`);
  const referenceKeySet = new Set(referenceKeys);
  const extraKeys = localeKeys.filter(k => !referenceKeySet.has(k));
  for (const key of extraKeys) assert(false, `[${locale}] Extra key (not in en): ${key}`);
  if (missingKeys.length === 0 && extraKeys.length === 0) {
    assert(true, null);
    console.log(`  ✅ ${locale}: all ${referenceKeys.length} keys present`);
  }
}

for (const locale of SUPPORTED_LOCALES) {
  for (const key of referenceKeys) {
    const value = getNestedValue(messages[locale], key);
    if (typeof value === 'string') {
      assert(value.trim().length > 0, `[${locale}] Empty value for key: ${key}`);
    }
  }
}

for (const locale of SUPPORTED_LOCALES) {
  for (const key of referenceKeys) {
    const value = getNestedValue(messages[locale], key);
    if (typeof value === 'string' && value.includes('{plural')) {
      assert(value.includes('one {') && value.includes('other {'), `[${locale}] Key "${key}" has {plural} but missing 'one' or 'other' form`);
    }
  }
}

console.log('─'.repeat(50));
if (failed === 0) {
  console.log(`\n  ✅ All tests passed! (${passed} checks across ${SUPPORTED_LOCALES.length} locales)\n`);
  process.exit(0);
} else {
  console.log(`\n  ❌ ${failed} test(s) failed:\n`);
  for (const err of errors) console.log(`    • ${err}`);
  console.log('');
  process.exit(1);
}
