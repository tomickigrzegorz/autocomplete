# Simple autosuggest/autocomplete with async/await method

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

[Live DEMO](http://www.grzegorztomicki.pl/serwisy/autosuggest/)

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
search | String |   | ✔ | Search id our input
searchBy | String |   | ✔ | The name of the element after which we do a search
dataAPI -> searchLike | Boolean |   | ✔ | This parameter controls whether we append the search text to url `http://localhost:3005/persons?like=search-text`
dataAPI -> path | String |   | ✔ | Path to our Rest API or static file
searchOutputUl | String | `output-list`  |  | Container with our list
clearButton | Boolea | `false` |  | The parameter set to `true` adds a button to delete the text from the input field, a small `x` to the right of the input field 
searchMethod | Boolean | `false` |  | `true` we are looking from the beginning of the string, if the parameter is missing or is set to `false` then we are looking in the whole string
isActive | String | `active` |  | Show/hide our result
isLoading | String | `loading`  |  | Spinner class
activeList | String | `active-list`  |  | Highlight li on mouse or keyup/keydown
error | String | `error`  |  | Adding class error
placeholderError | String | `something went wrong...`  |  | Adding plaseholder
delay | Number | `1000` |  | Delay without which the server would not survive ;)
howManyRecordsShow | Number | `10` |  | How many records will be shown
howManyCharacters | Number | `1` |  | The number of characters entered should start searching
specificOutput | Function | `<li><a href="searchBy">searchBy</a></li>` |  | Function that creates the appearance of the result

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
```javascript
  const options = {
            search: 'search',
    searchOutputUl: 'output-list',
          isActive: 'is-active',
         isLoading: 'is-loading',
        activeList: 'active-list',
             error: 'error'
  placeholderError: 'something went wrong...',
             delay: 1000,
howManyRecordsShow: 10,
 howManyCharacters: 1,
           dataAPI: {
        searchLike: true,
              path: process.env.ASSET_PATH
          },
          searchBy: 'name'
    specificOutput: function ({ name, gender, address, matches }) {
          return '' +
            '<li>' +
              '<a href=' + name + '>' +
                name.replace(new RegExp(matches[0], 'i'), str => '<b>' + str + '</b>') +
              '</a>' +
              '<div class="info">' +
                '<div class="icon gender-' + gender + '"></div>' +
                '<div class="address">' + address + '</div>' +
              '</div>' +
            '</li>';
          }
  }

  new searchJson(options);
```

### Minimal config
```javascript
const options = {
    search: 'search',
  searchBy: 'name',
   dataAPI: {

// searched from static file
searchLike: false
      path: './static/_persons.json'

// searched from https://yoururl.com
searchLike: false
      path: 'https://jsonplaceholder.typicode.com/users'

// searched from dynamic API https://yoururl.com?like=searched-text
searchLike: true
      path: 'https://jsonplaceholder.typicode.com/users?name_like='
 }
});
```

## ATTENTION
> The `searchLike` parameter is responsible for the way the data will be downloaded. If our api allows you to download data dynamically to the parameter `searchLike: true` the search text will be appended to the link `https://jsonplaceholder.typicode.com/users?name_like=appended-text` if our api does not support it or we want to download from a static json file then set the parameter `searchLike: false` and `https://jsonplaceholder.typicode.com/users`.


## Add your own result template

We have json, are looking for the element by ```name```
```json
{
  "index": 0,
  "name": "Mierra Hamilton",
  "gender": "male",
  "address": "943 Raleigh Place, Harmon, Idaho, 8481"
},
{
  "index": 1,
  "name": "Jody Conley",
  "gender": "female",
  "address": "980 Preston Court, Thynedale, Oregon, 6050"
},
```

We need to add your own look of search results
> Important if you want to have the highlighted text you have typed in the matches variable must be added adding last element ```matches```

### E6 version
```html
...
searchBy: 'name',
specificOutput: function ({ name, gender, address, matches }) {
    return '' +
      '<li>' +
        '<a href=' + name + '>' +
          name.replace(new RegExp(matches[0], 'i'), str => '<b>' + str + '</b>') +
        '</a>' +
        '<div class="info">' +
          '<div class="icon gender-' + gender + '"></div>' +
          '<div class="address">' + address + '</div>' +
        '</div>' +
      '</li>';
    }
}

new searchJson(options);
```

### E5 version compatible with IE10/11
```html
...
searchBy: 'name',
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

new searchJson(options);
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