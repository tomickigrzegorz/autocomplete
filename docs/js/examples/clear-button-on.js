new Autocomplete("clear-button-on", {
  // show clear button on initial
  clearButtonOnInitial: true,

  onSearch: ({ currentValue }) => {
    const api = `https://breakingbadapi.com/api/characters?name=${encodeURI(
      currentValue
    )}`;
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),
});
