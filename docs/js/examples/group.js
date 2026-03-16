new Autocomplete("group", {
  // enter a class name, this class will
  // be added to the group name elements
  classGroup: "group-by",

  onSearch: async ({ currentValue }) => {
    const api = "./characters.json";
    const response = await fetch(api);
    const data = await response.json();
    // first, we sort by our group, in our case
    // it will be the status, then we sort by name
    // of course, it is not always necessary because
    // such soroting may be obtained from REST API
    return data
      .filter((el) => new RegExp(currentValue, "i").test(el.name))
      .sort(
        (a, b) =>
          a.status.localeCompare(b.status) ||
          a.name.localeCompare(b.name),
      );
  },

  onResults: ({ currentValue, matches, classGroup }) => {
    // counting status elements
    function count(status) {
      let count = {};
      matches.map((el) => {
        count[el.status] = (count[el.status] || 0) + 1;
      });
      return `<small>${count[status]} items</small>`;
    }

    return matches
          .map((el, index, array) => {
            // we create an element of the group
            let group =
              el.status !== array[index - 1]?.status
                ? `<li class="${classGroup}"><span>${el.status}</span> ${count(
                    el.status,
                  )}</li>`
                : "";

            return `
              ${group}
              <li class="icon loupe">
                <p>${el.name.replace(
                  new RegExp(currentValue, "gi"),
                  (str) => `<b>${str}</b>`,
                )}</p>
              </li>`;
          })
          .join("");
  },

  onSelectedItem: ({ index, element, object }) => {
    console.dir({ index, element, object });
  },

  noResults: ({ currentValue }) =>
    `<li>No results found: "${currentValue}"</li>`,
});
