new Autocomplete("no-results", {
  onSearch: ({ currentValue }) => {
    const api = "./characters.json";
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          const result = data
            .filter((el) => new RegExp(currentValue, "i").test(el.name))
            .sort((a, b) => a.name.localeCompare(b.name));
          resolve(result);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),

  noResults: ({ element }) => `<li>No results found: "${element.value}"</li>`,
});
