# Simple autosuggest with async/await method

## Initialization
Before the first use, clone this repository and install node dependencies:

```yarn``` or ```npm install```

## Run the app
At the beginning run [JSON Server](http://jsonplaceholder.typicode.com/) after starting the server, see this address [http://localhost:3004/country](http://localhost:3004/country)

```yarn server``` or ```npm run server```

Next to run the app, just call:

```yarn dev``` or ```npm run start```

The final code:

```yarn prod```

## Configuration of the plugin

A library [Skeleton CSS](https://github.com/dhg/Skeleton) was used for the project  library.

HTML
```
<div class="search">
  <input type="text" id="search" class="u-full-width" data-item-row="10" placeholder="Enter country...">
</div>
```
JAVASCRIPT
```
  const options = {
    delay: 1000, // delay without which the server would not survive ;)

    search: 'search', // search id our input
    
    searchOutput: 'output-search', // our result
    
    searchOutputUl: 'output-list', // container with our list
    
    isActive: 'is-active', // class to show our result
    
    isLoading: 'is-loading', // adding our spinner class
    
    listItem: 'list-auto-item', // set class name for everyone li
    
    activeList: 'active-list', // highlight li on mouse or keyup/keydown
    
    howManyRecordsShow: 'data-item-row', // number of records displayed
    
    howManyCharacters: 1, // the number of characters entered should start searching
    
    urlPath: process.env.ASSET_PATH // path to our API
  }

  new searchJson(options);
```

## Checked under the following last browsers

* Desktop:
  * Chrome
  * Opera
  * Firefox
  * Microsoft Edge
  * Vivaldi
  * IE11/IE10

* Mobile:
  * Chrome
  * Firefox
  * Opera
  * Microsoft Ege
