new Autocomplete("static", {
  onSearch: ({ currentValue }) => {
    // static file
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

  onResults: ({ currentValue, matches }) => {
    return matches
      .map((el) => {
        return `
          <li class="loupe">
            <p>${el.name.replace(
              new RegExp(currentValue, "gi"),
              (str) => `<b>${str}</b>`,
            )}</p>
          </li>`;
      })
      .join("");
  },
});
