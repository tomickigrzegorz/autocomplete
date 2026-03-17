import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AutocompleteComponent } from "@tomickigrzegorz/autocomplete-angular";

interface Character {
  char_id: number;
  name: string;
  img: string;
  status: string;
}

const API =
  "https://raw.githubusercontent.com/tomickigrzegorz/autocomplete/master/docs/characters.json";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, AutocompleteComponent],
  template: `
    <div class="container">
      <h1>
        <span class="badge">Angular</span> Autocomplete demo
      </h1>
      <p class="hint">Breaking Bad characters — type a name</p>

      <div class="auto-search-wrapper">
        <ngx-autocomplete
          [onSearch]="onSearch"
          [onResults]="onResults"
          [onSubmit]="onSubmit"
          placeholder="e.g. Walter"
        />
      </div>

      <div class="selected-card" *ngIf="selected">
        <img [src]="selected.img" [alt]="selected.name" />
        <div>
          <strong>{{ selected.name }}</strong>
          <span>{{ selected.status }}</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  selected: Character | null = null;

  onSearch = async ({ currentValue }: { currentValue: string }) => {
    const res = await fetch(API);
    const data: Character[] = await res.json();
    return data
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((el) => el.name.match(new RegExp(currentValue, "gi")));
  };

  onResults = ({
    currentValue,
    matches,
  }: {
    currentValue: string;
    matches: Character[];
  }) =>
    matches
      .map(
        (el) => `
        <li>
          <img src="${el.img}" alt="${el.name}" width="32" height="32" />
          <p>${el.name.replace(new RegExp(currentValue, "gi"), (s) => `<b>${s}</b>`)}</p>
          <small>${el.status}</small>
        </li>`,
      )
      .join("");

  onSubmit = ({ object }: { object: Character }) => {
    this.selected = object;
  };
}
