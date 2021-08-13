window.addEventListener('DOMContentLoaded', () => {
  // add styles to the header responsible for
  // displaying the results above the search field
  (function () {
    const head = document.getElementsByTagName('head')[0];
    const css = document.createElement('style');

    const style = `
      .auto-list-up ul {
        border-top: 1px solid #858585;
        border-bottom: none;
        border-radius: 10px 10px 0 0;
        box-shadow: none;
      }
      .auto-list-up .auto-expanded {
        border-radius: 0 0 10px 10px;
      }
    `;

    css.appendChild(document.createTextNode(style));
    head.appendChild(css);
  })();

  /**
   * dynamic-list-position
   */
  new Autocomplete('dynamic-list-position', {
    insertToInput: true,
    cache: true,

    onSearch: ({ currentValue }) => {
      // local data
      const data = [
        { name: 'Walter White' },
        { name: 'Jesse Pinkman' },
        { name: 'Skyler White' },
        { name: 'Walter White Jr.' },
      ];
      return data
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((element) => {
          return element.name.match(new RegExp(currentValue, 'i'));
        });
    },

    onOpened: ({ element, results }) => {
      // we check if there is room for input for results
      const position =
        element.getBoundingClientRect().bottom +
          results.getBoundingClientRect().height >
        (window.innerHeight || document.documentElement.clientHeight);

      // if there is no room for results under the input field
      // in the page view, we raise the results above the input field
      if (position) {
        results.style.bottom = `${element.offsetHeight - 1}px`;
      } else {
        results.removeAttribute('style');
      }

      // when checking the parent element, we also add a class based
      // on which we format the appearance of the results and their posture
      results.parentNode.classList[position ? 'add' : 'remove']('auto-list-up');
    },

    onResults: ({ matches }) => {
      return matches
        .map((el) => {
          return `
            <li>${el.name}</li>`;
        })
        .join('');
    },
  });
});
