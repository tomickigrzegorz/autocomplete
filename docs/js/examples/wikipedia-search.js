new Autocomplete("wikipedia-search", {
  delay: 400,
  howManyCharacters: 2,
  removeResultsWhenInputIsEmpty: true,

  onSearch: ({ currentValue }) =>
    fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(currentValue)}&format=json&origin=*&srlimit=5`,
    )
      .then((r) => r.json())
      .then((data) => data.query.search),

  onResults: ({ currentValue, matches }) =>
    matches
      .map(
        ({ title, snippet, pageid }) =>
          `<li>
            <a
              href="https://en.wikipedia.org/?curid=${pageid}"
              target="_blank"
              class="wiki-result"
            >
              <div class="wiki-title-wrapper">
                <strong class="wiki-title">${title.replace(
                  new RegExp(currentValue, "gi"),
                  (s) => `<mark>${s}</mark>`,
                )}</strong>
              </div>
            </a>
            <span class="wiki-snippet">${snippet.replace(/<[^>]+>/g, "").slice(0, 50)}…</span>
          </li>`,
      )
      .join(""),

  onLoading: ({ currentValue }) =>
    `<li class="wiki-loading">Searching Wikipedia for "<strong>${currentValue}</strong>"…</li>`,

  noResults: ({ currentValue }) =>
    `<li class="wiki-no-results">No Wikipedia articles found for "<strong>${currentValue}</strong>"</li>`,

  onSubmit: ({ object }) => {
    window.open(
      `https://en.wikipedia.org/?curid=${object.pageid}`,
      "_blank",
      "noopener,noreferrer",
    );
  },
});
