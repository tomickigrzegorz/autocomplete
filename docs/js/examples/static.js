window.addEventListener('DOMContentLoaded', () => {

  /**
    * STATIC FILE
    */

  new Autocomplete('static', {
    // onSearch
    onSearch: ({ currentValue }) => {
      // static file
      const api = '../../data/characters.json';

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

    onResults: ({ currentValue, matches }) => {
      return matches
        .map(el => {
          return `
        <li class="loupe">
          <p>${el.name.replace(new RegExp(currentValue, 'gi'), (str) => `<b>${str}</b>`)}</p>
        </li>`;
        })
        .join('');
    }
  });

});