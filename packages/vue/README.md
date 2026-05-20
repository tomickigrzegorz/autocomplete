# @tomickigrzegorz/autocomplete-vue

Vue 3 wrapper for [@tomickigrzegorz/autocomplete](https://github.com/tomickigrzegorz/autocomplete).

## Installation

```bash
npm install @tomickigrzegorz/autocomplete-vue @tomickigrzegorz/autocomplete
# or
yarn add @tomickigrzegorz/autocomplete-vue @tomickigrzegorz/autocomplete
```

## Usage

```vue
<script setup lang="ts">
import { AutocompleteInput } from "@tomickigrzegorz/autocomplete-vue";
import "@tomickigrzegorz/autocomplete/css";

const onSearch = async ({ currentValue }) => {
  const res = await fetch(`/api/search?q=${currentValue}`);
  return res.json();
};

const onResults = ({ currentValue, matches }) =>
  matches.map((el) => `<li>${el.name}</li>`).join("");

const onSubmit = ({ object }) => {
  console.log("selected:", object);
};
</script>

<template>
  <div class="auto-search-wrapper">
    <AutocompleteInput
      :onSearch="onSearch"
      :onResults="onResults"
      :onSubmit="onSubmit"
      placeholder="Search..."
    />
  </div>
</template>
```

## Props

All props mirror [`AutocompleteOptions`](https://github.com/tomickigrzegorz/autocomplete#options) from the core library.

| Prop | Type | Required | Description |
|------|------|:--------:|-------------|
| `onSearch` | `Function` | ✓ | Async search function, must return array |
| `onResults` | `Function` | | Render results as HTML string |
| `onSubmit` | `Function` | | Called when user selects an item |
| `onReset` | `Function` | | Called when input is cleared |
| `onOpened` | `Function` | | Called when dropdown opens |
| `onClose` | `Function` | | Called when dropdown closes |
| `onRender` | `Function` | | Called when results are rendered |
| `noResults` | `Function` | | Called when no results found |
| `onSelectedItem` | `Function` | | Called on each keyboard navigation |
| `onLoading` | `Function` | | Called during async loading, return HTML to show a loader |
| `delay` | `number` | | Debounce delay in ms (default: `500`) |
| `howManyCharacters` | `number` | | Min chars to trigger search (default: `1`) |
| `clearButton` | `boolean` | | Show clear button (default: `true`) |
| `clearButtonOnInitial` | `boolean` | | Show clear button on initial load if input has value (default: `false`) |
| `selectFirst` | `boolean` | | Auto-select first result (default: `false`) |
| `insertToInput` | `boolean` | | Insert selected value into input (default: `false`) |
| `showValuesOnClick` | `boolean` | | Show all values on input click (default: `false`) |
| `cache` | `boolean` | | Cache results (default: `false`) |
| `inline` | `boolean` | | Inline mode (default: `false`) |
| `disableCloseOnSelect` | `boolean` | | Keep dropdown open after selection (default: `false`) |
| `preventScrollUp` | `boolean` | | Preserve scroll position and highlighted item on input click (default: `false`) |
| `removeResultsWhenInputIsEmpty` | `boolean` | | Hide results when input becomes empty (default: `false`) |
| `dropdownParent` | `string \| HTMLElement` | | Element (or selector) to append the dropdown to — useful in modals with `overflow: hidden` |
| `dropdownAttrs` | `{ class?: string; style?: string }` | | Extra HTML attributes applied to the dropdown wrapper (when `dropdownParent` is set) |
| `regex` | `{ expression: RegExp; replacement: string }` | | Regex config used to escape special characters in the search term |
| `classPrefix` | `string` | | CSS class prefix |
| `classGroup` | `string` | | CSS class for grouping results |
| `classPreventClosing` | `string` | | CSS class on dropdown items that should not close the dropdown on click |
| `ariaLabelClear` | `string` | | ARIA label for the clear button |
| `placeholder` | `string` | | Input placeholder |
| `class` | `string` | | CSS class for the input element |

## Demo

```bash
cd examples/vue
yarn install
yarn dev
```

## License

MIT
