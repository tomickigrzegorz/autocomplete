new Autocomplete("regex", {
  // default /[|\\{}()[\]^$+*?]/g
  // we are replace "aaa" string with "Dr. Wong"
  insertToInput: true,
  selectFirst: true,
  regex: { expression: /aaa/g, replacement: "Dr. Wong" },

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
