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
    
    const data = await response.json();
    console.log(data.data)
    return data.data.results;
  }