# @tomickigrzegorz/autocomplete-svelte

Svelte wrapper for [@tomickigrzegorz/autocomplete](https://github.com/tomickigrzegorz/autocomplete).

## Installation

```bash
npm install @tomickigrzegorz/autocomplete-svelte @tomickigrzegorz/autocomplete
# or
yarn add @tomickigrzegorz/autocomplete-svelte @tomickigrzegorz/autocomplete
```

## Usage

```svelte
<script lang="ts">
  import AutocompleteInput from "@tomickigrzegorz/autocomplete-svelte";
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

<div class="auto-search-wrapper">
  <AutocompleteInput
    {onSearch}
    {onResults}
    {onSubmit}
    placeholder="Search..."
  />
</div>
```

## Props

| Prop | Type | Required | Description |
|------|------|:--------:|-------------|
| `onSearch` | `Function` | ✓ | Async search function, must return array |
| `onResults` | `Function` | | Render results as HTML string |
| `onSubmit` | `Function` | | Called when user selects an item |
| `onReset` | `Function` | | Called when input is cleared |
| `onOpened` | `Function` | | Called when dropdown opens |
| `onClose` | `Function` | | Called when dropdown closes |
| `noResults` | `Function` | | Called when no results found |
| `onSelectedItem` | `Function` | | Called on each keyboard navigation |
| `onLoading` | `Function` | | Called during async loading |
| `delay` | `number` | | Debounce delay in ms (default: `500`) |
| `howManyCharacters` | `number` | | Min chars to trigger search (default: `1`) |
| `clearButton` | `boolean` | | Show clear button (default: `true`) |
| `selectFirst` | `boolean` | | Auto-select first result (default: `false`) |
| `insertToInput` | `boolean` | | Insert selected value to input (default: `false`) |
| `showValuesOnClick` | `boolean` | | Show all values on click (default: `false`) |
| `cache` | `boolean` | | Cache results (default: `false`) |
| `inline` | `boolean` | | Inline mode (default: `false`) |
| `classPrefix` | `string` | | CSS class prefix |
| `classGroup` | `string` | | CSS class for grouping |
| `placeholder` | `string` | | Input placeholder |
| `class` | `string` | | CSS class for input element |

## Demo

```bash
cd examples/svelte
yarn install
yarn dev
```

## License

MIT
