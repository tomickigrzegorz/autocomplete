# @tomickigrzegorz/autocomplete-angular

Angular wrapper for [@tomickigrzegorz/autocomplete](https://github.com/tomickigrzegorz/autocomplete).

Requires Angular 16+ (standalone components).

## Installation

```bash
npm install @tomickigrzegorz/autocomplete-angular @tomickigrzegorz/autocomplete
```

Add autocomplete CSS to `angular.json`:

```json
"styles": [
  "node_modules/@tomickigrzegorz/autocomplete/dist/css/autocomplete.min.css",
  "src/styles.css"
]
```

## Usage

```ts
// app.component.ts
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AutocompleteComponent } from "@tomickigrzegorz/autocomplete-angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, AutocompleteComponent],
  template: `
    <div class="auto-search-wrapper">
      <ngx-autocomplete
        [onSearch]="onSearch"
        [onResults]="onResults"
        [onSubmit]="onSubmit"
        placeholder="Search..."
      />
    </div>
  `,
})
export class AppComponent {
  onSearch = async ({ currentValue }: { currentValue: string }) => {
    const res = await fetch(`/api/search?q=${currentValue}`);
    return res.json();
  };

  onResults = ({ currentValue, matches }: { currentValue: string; matches: any[] }) =>
    matches.map((el) => `<li>${el.name}</li>`).join("");

  onSubmit = ({ object }: { object: any }) => {
    console.log("selected:", object);
  };
}
```

## Inputs

| Input | Type | Required | Description |
|-------|------|:--------:|-------------|
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
cd examples/angular
npm install
npm run dev
```

## License

MIT
