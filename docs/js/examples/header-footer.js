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
            .filter((el) => new RegExp(currentValue, "i").test(el.name))
            .sort((a, b) => a.name.localeCompare(b.name));
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
        `<div class="additional-elements"><small>${element.text}</small></div>`,
      );
    });
  },

  onSelectedItem: ({ element, object }) => {
    if (!object) return;
    element.value = object.name;
  },

  // counting status elements
  onResults: ({ matches }) => {
    console.log(matches);
    return matches
      .map(
        ({ name }) => `
        <li class="flex">
          <div class="name" title="clickable">${name}</div>
          <div class="additional-elements" title="not clickable">
            <span>not clickable place</span></div>
        </li>`,
      )
      .join("");
  },
});
