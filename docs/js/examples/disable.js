const autocomplete = new Autocomplete("disable", {
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

  onSubmit: () => {
    // keep input value
    autocomplete.disable();
    // or
    // remove input value
    // autocomplete.disable(true);
    // element.setAttribute("readonly", "readonly");
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),
});
