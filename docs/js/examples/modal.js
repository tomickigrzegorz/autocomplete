const modalSearch = document.querySelector(".modal-search");

new Autocomplete("modal-example", {
  insertToInput: true,
  cache: true,

  onSearch: ({ currentValue }) => {
    // local data
    const data = [
      {
        name: "Walter White",
        modal: "255,23,68",
      },
      {
        name: "Jesse Pinkman",
        modal: "62,39,35",
      },
      {
        name: "Skyler White",
        modal: "118,255,3",
      },
      {
        name: "Walter White Jr.",
        modal: "48,79,254",
      },
    ];
    return data
      .filter((el) => new RegExp(currentValue, "i").test(el.name))
      .sort((a, b) => a.name.localeCompare(b.name));
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),

  // add 'active-modal' class to modal div
  onOpened: () => {
    document.body.classList.add("active-modal");
    modalSearch.setAttribute("style", "z-index: 2");
  },

  // delete 'active-modal' class from modal if closing results
  onClose: () => {
    document.body.classList.remove("active-modal");
    modalSearch.removeAttribute("style");
  },

  onSelectedItem: ({ element, object }) => {
    const root = document.documentElement;

    if (object) {
      root.style.setProperty("--modal", object.modal);
      element.value = object.name;
    } else {
      root.style.removeProperty("--modal");
    }
  },
});
