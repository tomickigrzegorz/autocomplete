new Autocomplete("update-input", {
  insertToInput: true,
  cache: true,

  onSearch: ({ currentValue }) => {
    // local data
    const data = [
      { name: "Walter White" },
      { name: "Jesse Pinkman" },
      { name: "Skyler White" },
      { name: "Walter White Jr." },
    ];
    return data
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((element) => {
        return element.name.match(new RegExp(currentValue, "i"));
      });
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),

  onSelectedItem: ({ element, object }) => {
    if (!object) return;
    element.value = object.name;
  },
});
