window.addEventListener('DOMContentLoaded', () => {

  /**
   * NO-RESULTS
   */

  new Autocomplete('no-results', {
    onSearch: ({ currentValue }) => {
      const api = './characters.json';
      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            const result = data.sort((a, b) => a.name.localeCompare(b.name))
              .filter(element => {
                return element.name.match(new RegExp(currentValue, 'gi'))
              })
            resolve(result);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },

    onResults: ({ matches, template }) => {
      // checking if we have results if we don't
      // take data from the noResults callback
      return matches === 0 ? template : matches
        .map(el => {
          return `
            <li>${el.name}</li>`;
        }).join('');
    },

    noResults: ({ element, template }) => template(`<li>No results found: "${element.value}"</li>`)
  });

});