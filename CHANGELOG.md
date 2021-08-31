## 2021-08-31 (v1.5)

### Added

- `onRender` - callback function when we want to add additional elements, e.g. some buttons, links or plain text. See the Footer/Header e
  xample
- `classPreventClosing` - Prevents results from hiding after clicking on element with this class
- `Footer/Header` - new example, showing how to add an element above the results and below

### Changed

- wrap the results of additional divs. Useful when we want to add additional elements to the results, e.g. a legend, links, buttons, etc. See an example `Footer/Header`
- fixed: following a record when navigating records up/down with arrows and when using `classGroup`

## 2021-08-25 (v1.1.4)

### Changed

- fixed: clearButton [#89](https://github.com/tomik23/autocomplete/issues/89)

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

### Changed

- fix: Issue width 'clearButton' [#68](https://github.com/tomik23/autocomplete/issues/68)

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

### Changed

- fix: wrong cursor position in the input field [#62](https://github.com/tomik23/autocomplete/issues/62)

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

### Changed

- fix: 'no results' does not hidden [#52](https://github.com/tomik23/autocomplete/issues/52)

## 2021-01-20 (v1.0.27)

### Added

- new method `onSelectedItem`, get index and data from li element after hovering over li with the mouse or using arrow keys ↓ | ↑

## 2021-01-13 (v1.0.26)

### Changed

- fix: special characters are not removed [#49](https://github.com/tomik23/autocomplete/issues/49)

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
- fix: [#43](https://github.com/tomik23/autosuggest/issues/42)
- fix: remove typo

## 2020-09-01 (v1.0.20)

### Changed

- fix: debouncing issue [#40](https://github.com/tomik23/autosuggest/issues/40)
- fix: selectFirst [#38](https://github.com/tomik23/autosuggest/issues/38)

## 2020-08-31 (v1.0.19)

### Changed

- moving aria-label to the library

## 2020-08-30 (v1.0.18)

### Changed

- fix: Bad behavior when scrolling through the results with the up / down arrows [#35](https://github.com/tomik23/autosuggest/issues/35)
- refactoring

## 2020-08-28 (v1.0.17)

### Changed

- fix: aria-activedescendant
- update dependencies

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

### Changed

- fix: mouseenter is not reset previous selected li [#22](https://github.com/tomik23/autosuggest/issues/22)
- fix: Bad behavior of the scrollIntoView parameter [#20](https://github.com/tomik23/autosuggest/issues/20)
- update examples, new UI
- adding global styles
- update readme
- refactoring rollup
- highlight to prism
- Live Server instead [rollup-plugin-serve, rollup-plugin-livereload]

## 2020-08-19

### Added

- adding an additional example using data-elements

### Changed

- fix: Up-down arrows item selection [#17](https://github.com/tomik23/autosuggest/issues/17)
- remove promise-polyfill
- update dependencies
- update readme
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

### Changed

- fix: errors if we have more than one autocomplete field [#13](https://github.com/tomik23/autosuggest/issues/13)
- fix: Non-closing list of results [#15](https://github.com/tomik23/autosuggest/issues/15)
- adding two fields to the example
- update readme

## 2020-08-15

### Added

- github corner
- fix: scrollIntoView [#12](https://github.com/tomik23/autosuggest/issues/12)

### Changed

- update example
- update readme

## 2020-08-13

### Added

- selectFirst - default selects the first item in the list of results
- rollup
- .prettierrc

### Changed

- update aria
- update dependencies
- update readme

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
- update dependencies
- update readme
- update eslintrc
- update webpack.config.js

## 2020-08-04

### Added

- changelog
- noResult
- accessible for ARIA attributes and keyboard interactions

### Changed

- fix the 'x' button is not hidden fixed
- fix no reset of settings
- update dependencies
- update readme
- update webpack.config.js

## 2020-08-01

### Changed

- update dependencies
- update example wikipedia

## 2020-06-22

### Changed

- fix: many spaces

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

### Changed

- fixing issue with fast typing
- a small change that improves the look

## 2019-05-07

### Added

- adding license
- the appearance of the error

### Changed

- fixing a problem with several elements of inputs
- changing class name

## 2019-05-06

### Added

- specific output template

### Changed

- fixed IE10/11
- update specificOutput compatible IE10/11

## 2019-05-05

### Added

- remove special characters from input
- searchBy - searching by element

## 2019-05-04

### Added

- eslint and prettier adding
- source-map dev/prod
