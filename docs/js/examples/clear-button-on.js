new Autocomplete("clear-button-on", {
  // show clear button on initial
  clearButtonOnInitial: true,

  onSearch: ({ currentValue }) => {
    const api = `https://rickandmortyapi.com/api/character?name=${encodeURI(
      currentValue,
    )}`;
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          resolve(data.results);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  onResults: ({ matches }) =>
    matches.map(({ name }) => `<li>${name}</li>`).join(""),
});
