export default async function getLibraries() {
  const body = {
    search_query: "ulb",
  };
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
    })
  
  let data = await response.json();

  // Fine tune the results since Affluences API is not very good
  data = data.data.results.map(result => {
      if (result.slug === "ulb-bss") {
          result.booking_available = true;
          result.id = '1cfa0e6f-8ba7-480b-a8d5-30026eda503b'; // ID of batiment D
      }
      if (result.slug === "ulb-bonn-hb") {
        result.booking_available = false;
      }
      return result;
  });

  return data;
}
