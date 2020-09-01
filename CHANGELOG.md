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
