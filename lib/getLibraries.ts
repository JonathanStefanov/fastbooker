import { getUniversity, DEFAULT_UNIVERSITY } from './universities';
import type { Library } from '@/types';

export default async function getLibraries(universityId: string = DEFAULT_UNIVERSITY): Promise<Library[]> {
  const uni = getUniversity(universityId);
  const allResults: Library[] = [];
  let currentPage = 0;
  let hasMorePages = true;

  while (hasMorePages) {
    const body = {
      search_query: uni.searchQuery,
      page: currentPage,
    };
    
    try {
      const response = await fetch("https://api.affluences.com/app/v3/sites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json, text/plain, */*",
          "Accept-Language": "fr",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Origin": "https://affluences.com",
          "Referer": "https://affluences.com/",
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) break;
      
      const data = await response.json();
      if (!data?.data?.results) break;
      
      const results: Library[] = data.data.results;
      if (results.length === 0) break;
      
      allResults.push(...results);
      
      const hasNext = data.data.next ?? null;
      const total = data.data.total ?? null;
      
      if (hasNext === false) hasMorePages = false;
      else if (total !== null && allResults.length >= total) hasMorePages = false;
      else if (results.length < data.data.max_size) hasMorePages = false;
      else {
        currentPage++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Error fetching libraries page ${currentPage}:`, error);
      break;
    }
  }

  let validLibraries = allResults.filter(library => 
    library?.id && library.primary_name
  );

  for (const library of validLibraries) {
    const override = uni.libraryOverrides[library.slug ?? ''];
    if (override?.forceBookingAvailable !== undefined) {
      library.booking_available = override.forceBookingAvailable;
    }
  }

  return validLibraries;
}
