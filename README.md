# Simple autosuggest with async/await method

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
**search** | `String` |   | ✔ | Search id our input
**searchOutputUl** | `String` | `output-list`  |  | Container with our list
**isActive** | `String` | `active` |  | Show/hide our result
**isLoading** | `String` | `loading`  |  | Spinner class
**activeList** | `String` | `active-list`  |  | Highlight li on mouse or keyup/keydown
**error** | `String` | `error`  |  | Adding class error
**placeholderError** | `String` | `something went wrong...`  |  | Adding plaseholder
**delay** | `Number` | `1000` |  | Delay without which the server would not survive ;)
**howManyRecordsShow** | `Number` | `10` |  | How many records will be shown
**howManyCharacters** | `Number` | `1` |  | The number of characters entered should start searching
**urlPath** | `String` |   | ✔ | Path to our Rest API
**searchBy** | `String` |   | ✔ | The name of the element after which we do a search
**specificOutput** | `Function` | `<li><a href="searchBy">searchBy</a></li>` |  | Function that creates the appearance of the result

HTML
```html
<div class="search">
  <input type="text" id="search" class="u-full-width" placeholder="Enter country...">
</div>
```
JAVASCRIPT
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
           urlPath: process.env.ASSET_PATH
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

Minimal config
```javascript
const options = {
  search: 'search',
  urlPath: process.env.ASSET_PATH,
  searchBy: 'name',
});
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

> The appearance of the error

![Screenshot2](https://github.com/tomik23/autosuggest/blob/master/static/error.png)

## Browser Compatibility

**Desktop:**
Browser | Version
---- | :----
**Chrome**|74+
**Opera** | 58+
**Firefox**|66+
**Edge**|44+
**Vivaldi**|2.4+
**IE** |10+

**Mobile:**
Browser | Version
---- | :----
**MI Android**|10.6+
**Chrome**|74+
**Firefox**|66+
**Opera**|51+
**Ege**|42+

## License
This project is available under the [MIT](https://opensource.org/licenses/mit-license.php) license.  