const phone = new Autocomplete("show-all-values", {
  clearButton: false,
  cache: true,

  // this option will toggle showing all values when
  // the input is clicked, like a default dropdown
  showAllValues: true,

  onSearch: ({ currentValue }) => {
    // local data
    const api = "./phoneCodes.json";
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          // we are looking in two places "text" and "code"
          // {
          //   "text": "Poland",
          //   "id": "7",
          //   "flag": "https://flagcdn.com/w20/pl.png",
          //   "code": "+48"
          // },

          const result = data
            .sort((a, b) => a.text.localeCompare(b.text))
            .filter((element, i) => {
              if (
                element.text
                  .toLowerCase()
                  .indexOf(currentValue.replace(/\\/g, "")) >= 0 ||
                element.code
                  .toLowerCase()
                  .indexOf(currentValue.replace(/\\/g, "")) >= 0
              ) {
                return true;
              } else false;
            });
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
        // this part is sorted according to the order in styles,
        // we set the appropriate order with 'order'
        return `
          <li class="phone">
            <div class="phone__code">${el.code}</div>
            <div class="phone__country">${showMark(el.text, currentValue)}</div>
            <div class="phone__flag"><img src="${el.flag}"></div>
          </li>`;
      })
      .join("");
  },
});

function showMark(text, currentValue) {
  return currentValue
    ? text.replace(
        new RegExp(currentValue, "gi"),
        (str) => `<mark>${str}</mark>`
      )
    : text;
}

// clear data
const phoneClear = document.querySelector(".phone-clear");
phoneClear.addEventListener("click", () => {
  phone.destroy();
});
