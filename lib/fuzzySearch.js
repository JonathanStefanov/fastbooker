/**
 * Simple multi-term search utility
 * Splits search query by spaces and checks if ALL terms exist in the text
 * Each term is checked independently, so "E 1 16" finds text with E AND 1 AND 16
 */

/**
 * Simple search - checks if all search terms are present in the text
 *
 * @param {string} text - The text to search in
 * @param {string} query - The search query (space-separated terms)
 * @returns {boolean}
 */
export function simpleSearch(text, query) {
  if (!query || query.trim() === '') return true;
  if (!text) return false;

  const textLower = text.toLowerCase();
  // Split query by whitespace and filter out empty strings
  const queryTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);

  // Each term must be present in the text (independently)
  return queryTerms.every(term => textLower.includes(term));
}

/**
 * Search multiple fields - checks if all query terms exist in ANY of the fields
 *
 * @param {object} item - Object with fields to search
 * @param {string[]} fields - Array of field names to search in
 * @param {string} query - Search query
 * @returns {boolean}
 */
export function searchMultiField(item, fields, query) {
  if (!query || query.trim() === '') return true;

  // Combine all field values into one string
  const combinedText = fields
    .map(field => item[field] || '')
    .join(' ');

  return simpleSearch(combinedText, query);
}


