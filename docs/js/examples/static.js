new Autocomplete("static", {
  onSearch: async ({ currentValue }) => {
    // static file
    const api = "./characters.json";
    const response = await fetch(api);
    const data = await response.json();
    return data
      .filter((el) => new RegExp(currentValue, "i").test(el.name))
      .sort((a, b) => a.name.localeCompare(b.name));
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
