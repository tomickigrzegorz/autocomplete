let results = 0;
const maxRecords = 7;

new Autocomplete("records-result", {
  insertToInput: true,
  cache: true,
  classGroup: "group-by",

  onSearch: async ({ currentValue }) => {
    // clear array always when new searching
    results = [];

    const api = "./characters.json";
    const response = await fetch(api);
    const data = await response.json();
    const result = data
      .filter((el) => new RegExp(currentValue, "i").test(el.name))
      .sort((a, b) => a.name.localeCompare(b.name));

    // we set the number of record
    // to a global variable
    results = result.length;

    // show only 5 records
    return result.slice(0, maxRecords);
  },

  onResults: ({ currentValue, matches, classGroup }) => {
    return matches
          .map((el, index) => {
            let resultsCount =
              index === 0
                ? `<li class="${classGroup}">
                      <span>Displaying
                        <strong>${
                          maxRecords > matches.length
                            ? matches.length
                            : maxRecords
                        }</strong>
                        from
                        <strong>${results}</strong>
                      </span>
                    </li>`
                : "";

            return `
                ${resultsCount}
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
    console.log(index, element, object);
  },

  noResults: ({ currentValue }) =>
    `<li>No results found: "${currentValue}"</li>`,
});
