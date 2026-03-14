new Autocomplete("no-results", {
  onSearch: async ({ currentValue }) => {
    const api = "./characters.json";
    const response = await fetch(api);
    const data = await response.json();
    return data
      .filter((el) => new RegExp(currentValue, "i").test(el.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),

  noResults: ({ element }) => `<li>No results found: "${element.value}"</li>`,
});
