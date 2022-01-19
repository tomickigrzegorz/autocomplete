new Autocomplete("additional-elements", {
  cache: true,

  // prevents results from hiding after
  // clicking on element with this class
  // footer/header elements have this class
  // of course, any class name
  classPreventClosing: "additional-elements",

  onSearch: ({ currentValue }) => {
    const api = "./characters.json";

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

  // this function is responsible for rendering
  // additional elements above and below the results
  onRender: ({ results }) => {
    const elements = [
      { where: "beforebegin", text: "header element" },
      { where: "afterend", text: "footer element" },
    ];

    elements.map((element) => {
      results.insertAdjacentHTML(
        element.where,
        `<div class="additional-elements"><small>${element.text}</small></div>`
      );
    });
  },

  onSelectedItem: ({ element, object }) => {
    element.value = object.name;
  },

  // counting status elements
  onResults: ({ matches }) =>
    matches.map((el) => `<li>${el.name}</li>`).join(""),
});
