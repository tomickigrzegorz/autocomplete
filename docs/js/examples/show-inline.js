const inline = new Autocomplete("show-inline", {
  disableCloseOnSelect: true,
  insertToInput: true,

  // this option showing all values
  inline: true,

  onSearch: async ({ currentValue }) => {
    const currentValueCheck = currentValue
      ? `?name=${encodeURI(currentValue)}`
      : "";

    const api = `https://rickandmortyapi.com/api/character${currentValueCheck}`;
    const response = await fetch(api);
    const data = await response.json();
    return data.results
      .filter((el) => new RegExp(currentValue, "i").test(el.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  onResults: ({ matches }) =>
    matches.map(({ name }) => `<li>${name}</li>`).join(""),
});

// re-render the component when the clear button is clicked
const showValues = document.querySelector(".show-values");
showValues.addEventListener("click", (event) => {
  if (event.target.closest(".auto-clear")) {
    inline.rerender();
  }
});
