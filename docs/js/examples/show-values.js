const showAllValues = new Autocomplete("show-values", {
  disableCloseOnSelect: true,
  insertToInput: true,
  // this option showing all values
  showAllValues: true,

  onSearch: ({ currentValue }) => {
    const api =
      "https://raw.githubusercontent.com/tomickigrzegorz/autocomplete/master/docs/characters.json";
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          const result = data
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

document.addEventListener("click", (event) => {
  if (event.target.closest(".auto-clear")) {
    showAllValues.rerender();
  }
});
