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
      .filter((el) => new RegExp(currentValue, "i").test(el.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),

  // From now when insertToInput is true
  // the input value will be updated automatically
  // after hovering on an item from the list.
  // But if you want to modify the input value,
  // you can use the 'onSelectedItem' event.
  // onSelectedItem: ({ element, object }) => {
  //   if (!object) return;
  //   element.value = `${object.name} [${new Date().toLocaleDateString()}]`;
  // },
});
