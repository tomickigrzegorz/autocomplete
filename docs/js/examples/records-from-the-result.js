let results = 0;
const maxRecords = 7;

new Autocomplete("records-result", {
  insertToInput: true,
  cache: true,
  classGroup: "group-by",

  onSearch: ({ currentValue }) => {
    // clear array always when new searching
    results = [];

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

          // show only 5 records
          resolve(result.slice(0, maxRecords));

          // we set the number of record
          // to a global variable
          results = result.length;
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },

  onResults: ({ currentValue, matches, template, classGroup }) => {
    return matches === 0
      ? template
      : matches
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
                    (str) => `<b>${str}</b>`
                  )}</p>
                </li>`;
          })
          .join("");
  },

  onSelectedItem: ({ index, element, object }) => {
    console.log(index, element, object);
  },

  noResults: ({ currentValue, template }) =>
    template(`<li>No results found: "${currentValue}"</li>`),
});
