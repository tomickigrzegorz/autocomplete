new Autocomplete("preventScrollUp-output", {
  preventScrollUp: true,

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

  onResults: ({ matches }) => {
    return matches
      .map(
        ({ id, name, clone }) => `
        <li data-id="${id}" data-clone="${clone ?? false}" class="flex">
          <div class="name" title="clickable">${name}</div>
        </li>`
      )
      .join("");
  },
});
