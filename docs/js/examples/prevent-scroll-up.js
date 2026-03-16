new Autocomplete("preventScrollUp-output", {
  preventScrollUp: true,

  onSearch: async ({ currentValue }) => {
    const api = "./characters.json";
    const response = await fetch(api);
    const data = await response.json();
    return data
      .filter((el) => new RegExp(currentValue, "i").test(el.name))
      .sort((a, b) => a.name.localeCompare(b.name));
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
