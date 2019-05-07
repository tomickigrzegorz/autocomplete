# Simple autosuggest with async/await method

## Initialization
Before the first use, clone this repository and install node dependencies:

```yarn``` or ```npm install```

## Run the app
At the beginning run [JSON Server](http://jsonplaceholder.typicode.com/) after starting the server, see this address [http://localhost:3004/country](http://localhost:3004/country)

Next to run the app, just call:

```yarn dev``` or ```npm run dev```

The final code:

```yarn prod```

## Configuration of the plugin

A library [Skeleton CSS](https://github.com/dhg/Skeleton) was used in this project.

HTML
```html
<div class="search">
  <input type="text" id="search" class="u-full-width" placeholder="Enter country...">
</div>
```
JAVASCRIPT
```javascript
  const options = {
             delay: 1000, // delay without which the server would not survive ;)
            search: 'search', // search id our input    
    searchOutputUl: 'output-list', // container with our list   
          isActive: 'is-active', // class to show our result
         isLoading: 'is-loading', // adding our spinner class
        activeList: 'active-list', // highlight li on mouse or keyup/keydown
howManyRecordsShow: 10, // number of records displayed
 howManyCharacters: 1, // the number of characters entered should start searching
           urlPath: process.env.ASSET_PATH // path to our API
          searchBy: 'name' // searching by element
  }

  new searchJson(options);
```

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

E6 version
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

E5 version compatible with IE10/11
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

![Screenshot1](https://github.com/tomik23/autosuggest/blob/master/static/your-template.png)

## Tested on

* Desktop:
  * Chrome 74+ ✓
  * Opera 58+ ✓
  * Firefox 66+ ✓
  * Microsoft Edge 44+ ✓
  * Vivaldi 2.4+ ✓
  * IE11/IE10 ✓

* Mobile:
  + MI Android 10.6 ✓
  * Chrome 74+ ✓
  * Firefox 66+ ✓
  * Opera 51+ ✓
  * Microsoft Ege 42+ ✓

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.  