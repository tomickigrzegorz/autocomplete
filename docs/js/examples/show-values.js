const showAllValues = new Autocomplete("show-values", {
  disableCloseOnSelect: true,

  // this option showing all values
  showAllValues: true,

  onSearch: ({ currentValue }) => {
    const searchText = currentValue ? `?name=${encodeURI(currentValue)}` : "";
    const api = `https://rickandmortyapi.com/api/character${searchText}`;
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

function showMark(text, currentValue) {
  return currentValue
    ? text.replace(
        new RegExp(currentValue, "gi"),
        (str) => `<mark>${str}</mark>`,
      )
    : text;
}

document.addEventListener("click", (event) => {
  if (event.target.closest(".auto-clear")) {
    showAllValues.rerender();
  }
});
