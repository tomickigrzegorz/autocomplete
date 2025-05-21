## 2025-05-21 (3.0.0)
### Added
- typeScript definitions for `keyCodes.js` (`keyCodes.d.ts`)
- typeScript definitions for `function.js` (`function.d.ts`)
- improved immutability in `AutocompleteOptions` by using `Readonly`
- add type "button" to the clear button
- package.json - added `types` field to point to the TypeScript definition file
- added `autocomplete.d.ts` file for TypeScript definitions.
- remove IE support from the library

### Fixed
- ensured consistency between `autocomplete.d.ts` and `script.d.ts`
- added missing types for utility functions in `function.js`
- added JSDoc types for `keyCodes.js`
- remove tabindex for result wrapper ul


## 2025-03-03 (2.0.3)
### Added
- cache example - new example showing how to use the [data cache](https://tomickigrzegorz.github.io/autocomplete/#cache-example)

## 2024-06-04 (2.0.2)
### Added
- inline - this option displays all results without clicking on the input field
### Changed
- "showAllValues" changes name to "showAllValuesOnClick" this option will toggle showing all values when the input is clicked, like a default dropdown

## 2024-03-24 (2.0.1)
### Bug Fixes
- set default aria on initial input field
- aria-posinset start from 0, should be 1


## 2024-03-20 (2.0.0)
### Added
- removeResultsWhenInputIsEmpty - the parameter deletes the results. We use the `destroy()` method which removes the results from the DOM and returns everything to its original state.
- regex - the parameter allows you modify string before search. For example, we can remove special characters from the string. Default value is object `{ expression: /[|\\{}()[\]^$+*?]/g, replacement: "\\$&" }`

## 2023-10-03 (1.9.0)
### Added

- preventScrollUp - the parameter has been extended in such a way that the selected item (gray rows) is still visible after reopening the results.


## 2023-05-28 (1.8.9)
### Added

- preventScrollUp - parameter prevents the results from scrolling up when we have scrolling. It also works when we click a second time when we have results. The results are shown in the same place.

## 2023-05-14 (1.8.8)
### Added

- `rerender()` This method allows you to re-render the results without modifying the input field.
If we pass text rerender(string); then we render the results again and also replace the text in the input field. [rerender](https://tomickigrzegorz.github.io/autocomplete/#rerendr)

## 2023-05-01 (1.8.7)
### Added
- add banner
### Changes
- remove multiple 'mark' [items](https://tomickigrzegorz.github.io/autocomplete/#showAllValues)

## 2022-11-10 (1.8.6)
### Added
- `clearButtonOnInitial` A parameter set to `true` adds a button to remove text from the input field visible on initial Autocomplete. [clear-button-on](https://tomik23.github.io/autocomplete/#basics-clear-button-on)

## 2022-07-01 (1.8.5)
### Added
- `classPreventClosing` now also works for all items as a result of searches not only in footer/header [footer-header-example](https://tomik23.github.io/autocomplete/#footer)

## 2022-04-12 (1.8.4)
### Bug Fixes
- Reloaded site on click on enter [#145](https://github.com/tomik23/autocomplete/issues/145)

## 2022-03-21 (1.8.3)

### Test
- samples updated

## 2022-03-11 (1.8.3)

### Bug Fixes
- Show all values [#136](https://github.com/tomik23/autocomplete/issues/136)

### Changes
- the look of the page with examples

## 2022-03-04 (1.8.2)

### Added
- test 12: Check input field when press arrow down

### Build
- reducing the size of the library

### Changed
- all instances of innerHTML onto insertAdjacentHTML


## 2022-03-01 (1.8.1)
### Bug fixes
- Issue with 'selecFirst' + 'insertToInput' + 'cache' [#132](https://github.com/tomik23/autocomplete/issues/132)

## 2022-02-28 (1.8.0)

### Added
- tests [testcafe](https://testcafe.io/)

## 2022-02-10 (v1.7.5)
### Build
- added script to change library version everywhere during production build

### Performance
- reducing the size of the library by mangle properties and methods:
```js
mangle: {
  properties: {
    regex: /^_/,
  },
},
```

### Refactoring
- removing duplicate method 'setAttr'

## 2022-01-19 (v1.7.4)

### Changed
- clear button change [#124](https://github.com/tomik23/autocomplete/issues/124)

## 2022-01-10 (v1.7.3)

### Build
- new files for IE browsers (dist)
- IE version, refactor section width plugins (rollup)

### Styles
- seting singleQuote to false (prettierrc)

### Refactor
- moved the configuration babel.config.js to rollup.config.js

### Docs
- section updated 'Gatting started' (index.html)
- an example of using a library compatible with IE (docs/ie.html)


## 2021-12-28 (v1.7.2)

### Bug fixed
- improve handing of ESC key #120

## 2021-12-12 (v1.7.1)

### Bug fixed
- if `selectFirst: true` run callback function `onSelect`

### Refactor
- replace class auto-search -> auto-search-wrapper

### Build
- remove `*.map` from `*.min.js` file in dist folder

## 2021-11-18 (v1.7.0)

### Bug fixed
- arrow in example "show all values" don't open results #114

### Changed
- update example 'show-all-values'

## 2021-11-13 (v1.6.9)

### Bug fixes
- results do not scroll to the top [#111](https://github.com/tomik23/autocomplete/issues/111)

## 2021-11-12 (v1.6.8)

### Added
- global output folder `dist`

### Changed
- change of links to cdn


## 2021-11-12 (v1.6.7)

### Changed
- unminified file convert to ESM version

### Improvements
- build optimization (smaller file)


## 2021-11-04 (v1.6.6)

### Added
- unminified javascript file [#103](https://github.com/tomik23/autocomplete/issues/103)

## 2021-11-03 (v1.6.5)

### Bug fixes
- typo in clear label [#104](https://github.com/tomik23/autocomplete/issues/104) (thanks @bjarnef)

### Changed
- adding a new parameter that allows you to insert your own aria-label for the 'x' button to clear data in the input field.

## 2021-11-03 (v1.6.4)

### Bug fixes

- reset margin on autocomplete ul [#102](https://github.com/tomik23/autocomplete/issues/102) (thanks @bjarnef)


## 2021-09-23 (v1.6.3)

### Changed

- documentation improvements

## 2021-09-15 (v1.6.2)

### Added

- `classPrefix` - new props, add option for prefixing all autocomplete css class names [#97](https://github.com/tomik23/autocomplete/issues/97)

## 2021-09-13 (v1.6.1)

### Bug fixes

- Calback function 'onSearch' [#94](https://github.com/tomik23/autocomplete/issues/94)

## 2021-09-03 (v1.6.0)

### Added

- `showAllValues` - new props, this option will toggle showing all values when the input is clicked, like a default dropdown
- 'Show all values' - new example

### Changed

- 'rollup.config.js' to remove forgotten `console.log` and `debugger`
- rebuilding html with examples so you don't have to add js code to html manually. From now on, the code is dynamically downloaded from js as text and inserted into the appropriate place, and then presented by 'prism'

### Bug fixes

- when the results have a scroll bar, i.e. scroll overflow is set, we will scroll to the last record, for example, the scroll bar will be at the bottom. Closing and reopening the results causes a scroll and thus the results to the beginning of the container

## 2021-08-31 (v1.5.0)

### Added

- `onRender` - callback function when we want to add additional elements, e.g. some buttons, links or plain text. See the Footer/Header example
- `classPreventClosing` - prevents results from hiding after clicking on element with this class
- `Footer/Header` - new example, showing how to add an element above the results and below

### Changed

- wrap the results of additional divs. Useful when we want to add additional elements to the results, e.g. a legend, links, buttons, etc. See an example `Footer/Header`

### Bug fixes

- following a record when navigating records up/down with arrows and when using `classGroup`

## 2021-08-25 (v1.1.4)

### Bug fixes

- clearButton [#89](https://github.com/tomik23/autocomplete/issues/89)

## 2021-08-25 (v1.1.3)

### Changed

- refactoring style - [#86](https://github.com/tomik23/autocomplete/issues/86)

## 2021-08-24 (v1.1.2)

### Added

- new example: 'number of records from the result'

## 2021-08-12 (v1.1.1)

### Added

- new example: 'dynamic-list-position' [#84](https://github.com/tomik23/autocomplete/issues/84)

## 2021-08-10 (v1.1.0)

### Added

- `cache` - the characters entered in the input field are cached. This is best seen on the example [update-input-data](https://tomik23.github.io/autocomplete/#update-input-data) If we enter the letter `w`, we will see a list of 3 records `['Skyler White', 'Walter White', 'Walter White Jr.']`. By navigating through the records with the use of arrows (keyboard), the selected records are added to the input field. If the highlight is on `Walter White Jr.` and click the down arrow again, our original entry will appear in the input field, i.e. the letter `w`.

## 2021-06-29 (v1.0.44)

### Changed

- removal of an unused plug-in "rollup-plugin-postcss"

## 2021-06-12 (v1.0.43)

### Added

- callback function: `onClose`, use - e.g. after class deletion after closing results
- new example: [modal](https://tomik23.github.io/autocomplete/#modal)

## 2021-06-11 (v1.0.42)

### Changed

- wrapper class `search` renaming to `auto-search`
- use `postcss-css-variables` for backward compatibility for browsers

## 2021-06-02 (v1.0.41)

### Changed

- removing unnecessary icons and redundant styles from autocomplete.css main style

## 2021-05-15 (v1.0.40)

### Added

- `destroy()` this method removes the autocomplete instance and its bindings

## 2021-05-09 (v1.0.39)

### Fiexed

- issue width 'clearButton' [#68](https://github.com/tomik23/autocomplete/issues/68)

## 2021-04-26 (v1.0.38)

### Added

- `copy button` - copying examples using the button

## 2021-04-26 (v1.0.37)

### Changed

- ux improvement
- prismjs library updated

## 2021-04-05 (v1.0.36)

### Added

- `disableCloseOnSelect` - Prevents results from hiding after clicking on an item from the list
- new example: "Checkbox"

### Changed

- `clearButton` default on true

## 2021-04-01 (v1.0.35)

### Bug fixes

- wrong cursor position in the input field [#62](https://github.com/tomik23/autocomplete/issues/62)

## 2021-03-31 (v1.0.34)

### Added

- new example: "Update input field on selected items"

## 2021-02-26 (v1.0.33)

### Changed

- documentation and example

## 2021-02-23 (v1.0.32)

### Added

- to the example `Select multiple values ver 1` counting the selected elements
- `element` to noResults callback function

## 2021-02-05 (v1.0.31)

### Added

- select multiple values
- callback functions: `onReset`, `onOpened`

### Changed

- `howManyCharacters` changed from 2 over 1

## 2021-01-26 (v1.0.30)

### Added

- grouping the results [#55](https://github.com/tomik23/autocomplete/issues/55)

## 2021-01-23 (v1.0.29)

### Changed

- expanding demo examples

## 2021-01-21 (v1.0.28)

### Bug fixes

- 'no results' does not hidden [#52](https://github.com/tomik23/autocomplete/issues/52)

## 2021-01-20 (v1.0.27)

### Added

- new method `onSelectedItem`, get index and data from li element after hovering over li with the mouse or using arrow keys ↓ | ↑

## 2021-01-13 (v1.0.26)

### Bug fixes

- special characters are not removed [#49](https://github.com/tomik23/autocomplete/issues/49)

## 2021-01-13 (v1.0.25)

### Added

- data to the input field [#47](https://github.com/tomik23/autocomplete/issues/47)

## 2021-01-10 (v1.0.24)

### Added

- showing information: "no results"

## 2020-12-07 (v1.0.23)

### Changed

- renaming the repository to autocomplete

## 2020-11-21 (v1.0.22)

### Added

- UMD version, polyfill.js [closet, promise]

### Changed

- order in docs, move js and css to appropriate folders
- update dependencies

## 2020-09-10 (v1.0.21)

### Changed

- callback functions

### Fiexed

- scrollIntoView [#43](https://github.com/tomik23/autosuggest/issues/42)
- remove typo

## 2020-09-01 (v1.0.20)

### Bug fixes

- debouncing issue [#40](https://github.com/tomik23/autosuggest/issues/40)
- selectFirst [#38](https://github.com/tomik23/autosuggest/issues/38)

## 2020-08-31 (v1.0.19)

### Changed

- moving aria-label to the library

## 2020-08-30 (v1.0.18)

### Bug fixes

- bad behavior when scrolling through the results with the up / down arrows [#35](https://github.com/tomik23/autosuggest/issues/35)

## 2020-08-28 (v1.0.17)

### Bug fixes

- aria-activedescendant

## 2020-08-27 (v1.0.16)

### Added

- A simple error handling [#32](https://github.com/tomik23/autosuggest/issues/32)

## 2020-08-26 (v1.0.15)

### Changed

- the function `onSubmit` returns the object `matches`, and the text clicked `input`
- removing `dataElements`, all can now be obtained with the `onSubmit` function
- small improvements
- update readme

## 2020-08-23 (v1.0.14.1)

### Added

- active menu on scroll [#30](https://github.com/tomik23/autosuggest/pull/30)

## 2020-08-22 (v1.0.14)

### Added

- `babelHelpers: 'bundled'` to rollup
- `margin-left=20px` to `search-elements` when `media 950px`

### Changed

- up/down arrow [#28](https://github.com/tomik23/autosuggest/issues/28)
- reorganization of the scss structure
- changed dev and prod for sass in package.json

## 2020-08-21 (v1.0.13)

### Changed

- improve UI [#26](https://github.com/tomik23/autosuggest/issues/26)

## 2020-08-20 (v1.0.12)

### Fiexed

- mouseenter is not reset previous selected li [#22](https://github.com/tomik23/autosuggest/issues/22)
- bad behavior of the scrollIntoView parameter [#20](https://github.com/tomik23/autosuggest/issues/20)

### Changed

- update examples, new UI
- adding global styles
- update readme
- refactoring rollup
- highlight to prism
- Live Server instead [rollup-plugin-serve, rollup-plugin-livereload]

## 2020-08-19

### Added

- adding an additional example using data-elements

### Bug fixes

- up-down arrows item selection [#17](https://github.com/tomik23/autosuggest/issues/17)

### Changed

- remove promise-polyfill
- update dependencies/readme
- github-corner separate file

## 2020-08-18

### Added

- an example of using a static file

### Changed

- update dependencies

## 2020-08-17

### Added

- an example of using a static file

### Changed

- update dependencies

## 2020-08-16

### Fiexed

- errors if we have more than one autocomplete field [#13](https://github.com/tomik23/autosuggest/issues/13)
- non-closing list of results [#15](https://github.com/tomik23/autosuggest/issues/15)

### Changed

- adding two fields to the example
- update readme

## 2020-08-15

### Added

- github corner

### Bug fixes

- scrollIntoView [#12](https://github.com/tomik23/autosuggest/issues/12)

### Changed

- update example / readme

## 2020-08-13

### Added

- selectFirst - default selects the first item in the list of results
- rollup
- .prettierrc

### Changed

- update aria / dependencies / readme

## 2020-08-12

### Added

- adding an example of using jquery
- use Promises instead of async/await to avoid @babel/runtime
- adding a new 'onSearch' function where you can decide for yourself how the data will be downloaded [jquery, axios, fetch, ...]
- aria-describedby -> [attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_aria-describedby_attribute)
- new API for testing -> [breakingbadapi](https://breakingbadapi.com/documentation)

### Changed

- restoration of functionality 'howManyCharacters'
- reducing library size by removing babel-runtime
- remove noResult (temporarily?)
- remove prettier
- update dependencies / readme / eslintrc / webpack.config.js

## 2020-08-04

### Added

- changelog
- noResult
- accessible for ARIA attributes and keyboard interactions

### Bug fixes

- the 'x' button is not hidden fixed
- no reset of settings

### Changed

- update dependencies
- update readme
- update webpack.config.js

## 2020-08-01

### Changed

- update dependencies / example wikipedia

## 2020-06-22

### Bug fixes

- many spaces

## 2020-06-20

### Changed

- simplification of configuration

## 2020-06-19

### Added

- improved sorting

## 2020-06-18

### Changed

- update example

## 2020-05-21

### Added

- Button 'x' removes text from the input field
- improving the position of the 'x' button

### Changed

- update devDependencies

## 2020-05-10

### Added

- adding the option of choosing a search method

## 2020-05-09

### Added

- improve bundle size

## 2019-12-06

### Added

- adding BundleAnalyzerPlugin

### Changed

- removal @babel/polyfill

## 2019-11-07

### Added

- adding the ability to download data locally/API

### Changed

- correction of errors with the number of characters
- update devDependencies

## 2019-06-29

### Changed

- upgrade to core-js 3

## 2019-06-07

### Added

- adding license
- the appearance of the error

## 2019-05-27

### Changed

- update dependencies
- changing libraryTarget to umd

## 2019-05-14

### Bug fixes

- fixing issue with fast typing

### Changed

- a small change that improves the look

## 2019-05-07

### Added

- adding license
- the appearance of the error

### Bug fixes

- a problem with several elements of inputs

### Changed

- changing class name

## 2019-05-06

### Added

- specific output template

### Bug fixes

- fixed IE10/11

### Changed

- update specificOutput compatible IE10/11

## 2019-05-05

### Added

- remove special characters from input
- searchBy - searching by element
