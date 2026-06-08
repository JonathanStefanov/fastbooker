export function simpleSearch(text: string, query: string): boolean {
  if (!query || query.trim() === '') return true;
  if (!text) return false;

  const textLower = text.toLowerCase();
  const queryTerms = query.toLowerCase().trim().split(/\s+/).filter(term => term.length > 0);

  return queryTerms.every(term => textLower.includes(term));
}

export function searchMultiField(item: Record<string, unknown>, fields: string[], query: string): boolean {
  if (!query || query.trim() === '') return true;

  const combinedText = fields
    .map(field => String(item[field] || ''))
    .join(' ');

  return simpleSearch(combinedText, query);
}
