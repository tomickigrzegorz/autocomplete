const CACHE_TTL = 60000; // Cache valid for 60 seconds

async function fetchDataWithSessionCache(query) {
  if (!query) return [];

  // Get cache from sessionStorage
  const cacheData = sessionStorage.getItem("autocomplete-search");
  const cache = cacheData ? JSON.parse(cacheData) : {};

  // Checks if the cache contains the query and if it is not outdated
  if (cache[query] && Date.now() - cache[query].timestamp < CACHE_TTL) {
    console.log("Returning the result from sessionStorage for:", query);
    return cache[query].data;
  }

  // Downloading new data from API
  try {
    const response = await fetch(
      `https://rickandmortyapi.com/api/character?name=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    const results = data.results || [];

    // Saving results to sessionStorage
    cache[query] = { data: results, timestamp: Date.now() };
    sessionStorage.setItem("autocomplete-search", JSON.stringify(cache));

    return results;
  } catch (error) {
    console.error("Data download error:", error);
    return [];
  }
}

new Autocomplete("cache", {
  onSearch: ({ currentValue }) => fetchDataWithSessionCache(currentValue),

  onResults: ({ matches }) =>
    matches.map(({ name }) => `<li>${name}</li>`).join(""),
});
