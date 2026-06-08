import { getUniversity, DEFAULT_UNIVERSITY } from './universities';

/**
 * Fetch libraries from the Affluences API for a given university.
 * @param {string} universityId - The university ID (e.g. 'ulb', 'unipd')
 */
export default async function getLibraries(universityId = DEFAULT_UNIVERSITY) {
  const uni = getUniversity(universityId);
  const allResults = [];
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
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.110 Safari/537.36",
          "Origin": "https://affluences.com",
          "Referer": "https://affluences.com/",
          "Sec-Fetch-Site": "same-site",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
          "Sec-Ch-Ua": "",
          "Sec-Ch-Ua-Mobile": "?0",
          "Sec-Ch-Ua-Platform": ""
        },
        body: JSON.stringify(body),
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch libraries page ${currentPage}: ${response.status} ${response.statusText}`);
        break;
      }
      
      const data = await response.json();
      
      if (!data || !data.data || !data.data.results) {
        console.error(`Invalid API response structure on page ${currentPage}`);
        break;
      }
      
      const results = data.data.results;
      
      if (results.length === 0) {
        hasMorePages = false;
        break;
      }
      
      allResults.push(...results);
      
      const hasNext = data.data.next !== undefined ? data.data.next : null;
      const total = data.data.total !== undefined ? data.data.total : null;
      
      if (hasNext === false) {
        hasMorePages = false;
      } else if (total !== null && allResults.length >= total) {
        hasMorePages = false;
      } else if (results.length < data.data.max_size) {
        hasMorePages = false;
      } else {
        currentPage++;
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`Error fetching libraries page ${currentPage}:`, error);
      break;
    }
  }

  // Filter valid entries
  let validLibraries = allResults.filter(library => 
    library && 
    library.id && 
    library.primary_name
  );

  // Apply university-specific overrides
  for (const library of validLibraries) {
    const override = uni.libraryOverrides[library.slug];
    if (override) {
      if (override.forceBookingAvailable !== undefined) {
        library.booking_available = override.forceBookingAvailable;
      }
    }
  }

  console.log(`[${uni.shortName}] Total libraries fetched: ${allResults.length}, Valid: ${validLibraries.length}`);
  
  return validLibraries;
}
