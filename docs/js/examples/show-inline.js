const inline = new Autocomplete("show-inline", {
  disableCloseOnSelect: true,
  insertToInput: true,

  // this option showing all values
  inline: true,

  onSearch: ({ currentValue }) => {
    const currentValueCheck = currentValue
      ? `?name=${encodeURI(currentValue)}`
      : "";

    const api = `https://rickandmortyapi.com/api/character${currentValueCheck}`;

    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          const result = data.results
            .sort((a, b) => a.name.localeCompare(b.name))
            .filter((element) => {
              return element.name.match(new RegExp(currentValue, "gi"));
            });

          resolve(result);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  onResults: ({ matches }) =>
    matches.map(({ name }) => `<li>${name}</li>`).join(""),
});

// re-render the component when the clear button is clicked
document.addEventListener("click", (event) => {
  if (event.target.closest(".auto-clear")) {
    inline.rerender();
  }
});
