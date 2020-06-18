# Simple autosuggest/autocomplete with async/await method

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[Live DEMO](https://tomik23.github.io/autosuggest/)

![Screenshot1](https://github.com/tomik23/autosuggest/blob/master/static/your-template.png)

You can move between the records using the arrows <kbd>↓</kbd> <kbd>↑</kbd>, and confirm by <kbd>Enter</kbd>

> The appearance of the error

![Screenshot2](https://github.com/tomik23/autosuggest/blob/master/static/error.png)


## Initialization
Before the first use, clone this repository and install node dependencies:

```yarn``` or ```npm install```

## Run the app
Run the app, just call:

```yarn dev``` or ```npm run dev```

After starting the server [JSON Server](http://jsonplaceholder.typicode.com/), see this addresses [http://localhost:3004/country](http://localhost:3004/country) and [http://localhost:3005/persons](http://localhost:3005/persons)

The final code:

```yarn prod```

A library [Skeleton CSS](https://github.com/dhg/Skeleton) was used in this project.

## Configuration of the plugin

props | type | default | require | description
---- | :----: | :-------: | :--------: | -----------
dataAPI -> path | String |   | ✔ | Path to our Rest API or static file
specificOutput | Function | `<li><a href="searchBy">searchBy</a></li>` | ✔ | Function that creates the appearance of the result
dataAPI -> searchLike | Boolean | `false` |  | The `true` parameter controls whether we append the search text to the URL `http://localhost:3005/persons?like=search-text`
searchOutputUl | String | `output-list`  |  | Container with our list
clearButton | Boolea | `false` |  | The parameter set to `true` adds a button to delete the text from the input field, a small `x` to the right of the input field 
actions -> isActive | String | `active` |  | Show/hide our result
actions -> isLoading | String | `loading`  |  | Spinner class
activeList | String | `active-list`  |  | Highlight li on mouse or keyup/keydown
error -> error | String | `error`  |  | Adding class error
error -> placeholder | String | `something went wrong...`  |  | Adding plaseholder
delay | Number | `1000` |  | Delay without which the server would not survive ;)
howManyCharacters | Number | `1` |  | The number of characters entered should start searching

### HTML
```html
<div class="row">
  <label class="label" for="search">Search by letter</label>
  <div class="search">
    <input type="text" id="search" class="full-width" placeholder="Enter letter">
  </div>
</div>
```
### JAVASCRIPT
```js
const options = {
  searchBy: 'name', // searching by item
  output: 'output-list', // container output
  delay: 1000, // character delay
  activeList: 'active-list', // coloring results, records
  howManyCharacters: 1, // how many characters to search
  actions: {
    isActive: 'is-active', // show/hide results
    isLoading: 'is-loading', // loading animation
  },
  error: {
    error: 'error', // error class
    placeholder: 'something went wrong...',
  },
  dataAPI: {
    searchLike: true, // controlling the way data is downloaded
    path: process.env.ASSET_PATH, // static file or address
  },
  // this part is responsible for the number of records,
  // the appearance of li elements and it really depends
  //  on you how it will look
  specificOutput: function (matches) {
    const regex = new RegExp(`${matches[0]}`, 'gi');
    const html = matches.slice(1)
      .filter((element, index) => {
        return element.name.match(regex);
      })
      .sort((a, b) => a - b)
      .map(el => {
        return `<li>
            <p>${el.name.replace(regex, (str) => `<b>${str}</b>`)}</p>
          </li>`;
      });
      return html.join('');
  }
}

new Autosuggest('.element | #element', options);
```

## Add your own result template `specificOutput`

In fact, we can work on dynamic data or static files. Data can be in the form of an array or json. It's up to you what the results list will look like. You can configure everything yourself using the `specificOutput` method


### E6 version
```js
...
specificOutput: function (matches) {
  const regex = new RegExp(`${matches[0]}`, 'gi');
  const html = matches.slice(1)
    .filter((element, index) => {
      return element.name.match(regex);
    })
    .sort((a, b) => a - b)
    .map(el => {
      return `
        <li>
          <p>${el.name.replace(regex, (str) => `<b>${str}</b>`)}</p>
        </li>`;
    });
  return html.join('');
}

new Autosuggest('.element | #element', options);
```

### E5 version compatible with IE10/11
```js
...
specificOutput: function (options) {
  return '' +
    '<li>' +
      '<a href=' + options['name'] + '>' +
        options['name'].replace(new RegExp(options['matches'][0], 'i'), function (str) { return '<b>' + str + '</b>' }) +
      '</a>' +
      '<div class="info">' +
        '<div class="icon gender-' + options['gender'] + '"></div>' +
        '<div class="address">' + options['address'] + '</div>' +
      '</div>' +
    '</li>';
  }
}

new Autosuggest('.element | #element', options);
```

## Browsers support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/vivaldi/vivaldi_48x48.png" alt="Vivaldi" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Vivaldi |
| --------- | --------- | --------- | --------- | --------- |
| IE10, IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

### IE10, IE11

Will work if you use polyfill for promise.
There are three ways to add this polyfill:

1. Add the following script to your html
```html
<script type="text/javascript">
  if (!('Promise' in window)) {
    var script = document.createElement("script");
    script.src = "https://polyfill.io/v3/polyfill.min.js?features=Promise";
    document.getElementsByTagName('head')[0].appendChild(script);
  }
</script>
```

2. Add the script below to head in html 
```html
<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js"></script>
```

3. Add pollyfill to Autosuggest.js and build the script again 
```javascript
import 'promise-polyfill/src/polyfill';
```


## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.  