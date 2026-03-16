new Autocomplete("clear-button-on", {
  // show clear button on initial
  clearButtonOnInitial: true,

  onSearch: async ({ currentValue }) => {
    const api = `https://rickandmortyapi.com/api/character?name=${encodeURI(
      currentValue,
    )}`;
    const response = await fetch(api);
    const data = await response.json();
    return data.results;
  },

  onResults: ({ matches }) =>
    matches.map(({ name }) => `<li>${name}</li>`).join(""),
});
