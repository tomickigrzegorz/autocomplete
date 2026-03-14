new Autocomplete("remove-results", {
  removeResultsWhenInputIsEmpty: true,

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
