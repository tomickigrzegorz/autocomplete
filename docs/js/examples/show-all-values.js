const dropDownArrow = document.querySelector('.drop-down-arrow');

const phone = new Autocomplete('show-all-values', {
  clearButton: false,
  cache: true,

  // this option will toggle showing all values when
  // the input is clicked, like a default dropdown
  showAllValues: true,

  onSearch: ({ currentValue }) => {
    // local data
    const api = './phoneCodes.json';
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          // first, we sort by our group, in our case
          // it will be the status, then we sort by name
          // of course, it is not always necessary because
          // such soroting may be obtained from REST API
          const result = data
            .sort((a, b) => a.text.localeCompare(b.text))
            .filter((element) => {
              return element.text.match(new RegExp(currentValue, 'gi'));
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
            <div class="phone__country">${el.text.replace(
              new RegExp(currentValue, 'gi'),
              (str) => `<mark>${str}</mark>`
            )}</div>
            <div class="phone__flag"><img src="${el.flag}"></div>
          </li>`;
      })
      .join('');
  },

  onOpened: () => {
    dropDownArrow.classList.add('arrow-up');
  },

  onClose: () => {
    dropDownArrow.classList.remove('arrow-up');
  },
});

// clear data
const phoneClear = document.querySelector('.phone-clear');
phoneClear.addEventListener('click', () => {
  phone.destroy();
});
