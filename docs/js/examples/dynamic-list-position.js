new Autocomplete("dynamic-list-position", {
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

  onOpened: ({ element, results }) => {
    // we check if there is room for input for results
    const position =
      element.getBoundingClientRect().bottom +
        results.getBoundingClientRect().height >
      (window.innerHeight || document.documentElement.clientHeight);

    // if there is no room for results under the input field
    // in the page view, we raise the results above the input field
    if (position) {
      results.parentNode.style.bottom = `${element.offsetHeight - 1}px`;
    } else {
      results.parentNode.removeAttribute("style");
    }

    // when checking the parent element, we also add a class based
    // on which we format the appearance of the results and their posture
    results.parentNode.classList[position ? "add" : "remove"]("auto-list-up");
  },

  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),
});
