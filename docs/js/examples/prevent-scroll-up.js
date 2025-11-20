new Autocomplete("preventScrollUp-output", {
  preventScrollUp: true,

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

  onResults: ({ matches }) => {
    return matches
      .map(
        ({ name }) => `
        <li class="flex">
          <div class="name" title="clickable">${name}</div>
        </li>`,
      )
      .join("");
  },
});
