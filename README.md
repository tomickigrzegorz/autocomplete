<h1 align="center">
  autocomplete
</h1>

<p align="center">
  Simple autocomplete with asynchronous data fetch
</p>

<p align="center">
  <img src="https://img.shields.io/github/package-json/v/tomik23/autocomplete">
  <img src="https://img.shields.io/github/size/tomik23/autocomplete/docs/js/autocomplete.min.js">
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green.svg">
  </a>
</p>

<p align="center">
  <img src="static/01.png">
</p>

## Demo

See the demo - [example](https://tomik23.github.io/autocomplete/)

## Features

- Accessible, with full support for ARIA attributes and keyboard interactions.
- Customize your own CSS.
- Support for asynchronous data fetching.
- Move between the records using the arrows <kbd>↓</kbd> <kbd>↑</kbd>, and confirm by <kbd>Enter</kbd>
- No dependencies

## Initialization

Before the first use, clone this repository and install node dependencies:

```js
yarn
// or
npm install
```

## Run the app

Run the app, just call:

```js
yarn dev
// or
npm run dev
```

The final code:

```js
yarn prod
// or
npm run prod
```

## Installation

Download from `docs` folder:

- main.css
- autocomplete.css
- autocomplete.min.js

CSS

```html
<link rel="stylesheet" href="main.css" />
<link rel="stylesheet" href="autocomplete.css" />
```

HTML

```html
<div class="search">
  <input type="text" id="search" autocomplete="off" placeholder="Enter letter">
</div>
```

JavaScript

```html
<script>
  window.addEventListener('DOMContentLoaded', function () {
    new Autocomplete('search', {
      onSearch: (input) => {
        const api = `https://your-api.com?name=${encodeURI(input)}`;

        return new Promise((resolve) => {
          fetch(api)
            .then((response) => response.json())
            .then((data) => {
              resolve(data);
            });
        });
      },
      onResults: (matches, input) => {
        const regex = new RegExp(input, 'gi');
        return matches
          .filter((element, index) => {
            return element.name.match(regex);
          })
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((el) => {
            return `
              <li class="loupe">
                <p>${el.name.replace(regex, (str) => `<b>${str}</b>`)}</p>
              </li>`;
          })
          .join('');
      },
    });
  });
</script>
<script src="autocomplete.min.js"></script>
```

## Configuration of the plugin

| props | type | default | require | description |
| ----------------- | :--------: | :---------: | :-----: | --------------------------------------------- |
| element           |   String   |         | ✔ | Input field id |
| onSearch          |  Function  |         | ✔ | Function for user input. It can be a synchronous function or a promise |
| onResults         |  Function  |         | ✔ | Function that creates the appearance of the result |
| onSubmit          |  Function  |         |   | Executed on input submission   |
| noResults         |  Function  |         |   | Showing information: "no results"   |
| onSelectedItem    |  Function  |         |   | Get index and data from li element after hovering over li with the mouse or using arrow keys ↓/↑   |
| selectFirst       |  Boolean   | `false` |   | Default selects the first item in the list of results |
| clearButton       |  Boolean   | `false` |   | A parameter set to 'true' adds a button to remove text from the input field |
| insertToInput     |  Boolean   | `false` |   | Adding an element selected with arrows to the input field |
| howManyCharacters |   Number   |   `2`   |   | The number of characters entered should start searching |
| delay             |   Number   |  `500`  |         | Time in milliseconds that the component should wait after last keystroke before calling search function 1000 = 1s |
| ~~instruction~~   | ~~String~~ | ~~`When autocomplete results ...`~~ |         | ~~aria-describedby [attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute) A full text below~~ |

**instructions** - has been removed from the library, [see how to add to html](https://tomik23.github.io/autocomplete/)

## Usage jquery || axios || promise + fetch

JAVASCRIPT

```js
const options = {
  // search delay
  delay: 1000,

  // add button 'x' to clear the text from
  // the input filed
  clearButton: true,

  // default selects the first item in
  // the list of results
  selectFirst: true,

  // add text to the input field as you move through
  // the results with the up/down cursors
  insertToInput: true,

  // the number of characters entered
  // should start searching
  howManyCharacters: 2,

  // Function for user input. It can be a synchronous function or a promise
  // you can fetch data with jquery, axios, fetch, etc.
  onSearch: (input) => {
    // static file
    const api = './characters.json';

    // OR -------------------------------

    // controlling the way data is downloaded
    const api = `https://breakingbadapi.com/api/characters?name=${encodeURI(
      input
    )}`;

    /**
     * jquery
     */
    return $.ajax({
      url: api,
      method: 'GET',
    })
      .done(function (data) {
        return data;
      })
      .fail(function (xhr) {
        console.error(xhr);
      });

    // OR -------------------------------

    /**
     * axios
     */
    return axios
      .get(api)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      });

    // OR -------------------------------

    /**
     * Promise + fetch
     */
    return new Promise((resolve) => {
      fetch(api)
        .then((response) => response.json())
        .then((data) => {
          resolve(data);
        });
    });
  },

  // the method presents no results
  noResults: (input, resultRender) => resultRender(`<li>No results found: "${input}"</li>`),

  // this part is responsible for the number of records,
  // the appearance of li elements and it really depends
  // on you how it will look
  onResults: (matches, input) => {
    const regex = new RegExp(input, 'gi');

    // checking if we have results if we don't
    // take data from the noResults method
    return matches === 0 ? input : matches
      .filter((element, index) => {
        return element.name.match(regex);
      })
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((el) => {
        // this part is responsible for the appearance
        // in the drop-down list - see the example in index.html
        // remember only the first element from <li> is put
        // into the input field, in this case the text
        // from the <p> element
        return `
          <li class="loupe">
            <p>${el.name.replace(regex, (str) => `<b>${str}</b>`)}</p>
          </li>`;
      })
      .join('');
  },

  // the onSubmit function is executed when the user
  // submits their result by either selecting a result
  // from the list, or pressing enter or mouse button
  onSubmit: (matches, input) => {
    console.log(`You selected ${input}`);
    // you can open a window or do a redirect
    window.open(`https://www.imdb.com/find?q=${encodeURI(input)}`);
  },
};

// `element` this is the id of the input field
new Autocomplete('element', options);
```

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png" alt="Vivaldi" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Vivaldi |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE10, IE11, Edge                                                                                                                                                                                                | last 2 versions                                                                                                                                                                                                   | last 2 versions                                                                                                                                                                                               | last 2 versions                                                                                                                                                                                           | last 2 versions                                                                                                                                                                                                   |

### IE10, IE11

Will work if you use polyfill for promise and closest.
There are three ways to add this polyfill:

1. Add the following script to your html in head

```html
<script type="text/javascript">
  if (!('Promise' in window)) {
    var script = document.createElement('script');
    script.src =
      'https://polyfill.io/v3/polyfill.min.js?features=Promise%2CElement.prototype.closest';
    document.getElementsByTagName('head')[0].appendChild(script);
  }
</script>
```

2. Add the script below to head in html

```html
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/element-closest@3.0.2/browser.min.js"></script>
```

3. Add pollyfill to Autocomplete.js and build the script again

```javascript
import 'promise-polyfill/src/polyfill';
import './helpers/element-closest-polyfill.js';
```

4. You can download all polyfills from `docs/js/polyfill.js` and put in head html
```html
<script src="./polyfill.js"></script>
```

## More appearance examples

<div align="center">More complicated results</div>
<p align="center">
  <img src="static/examples.png">
</p>

## License

This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.
