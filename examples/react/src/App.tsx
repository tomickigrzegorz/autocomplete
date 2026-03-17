import { useState, useCallback } from "react";
import { AutocompleteInput } from "@tomickigrzegorz/autocomplete-react";
import "@tomickigrzegorz/autocomplete/css";
import "./app.css";

const API =
  "https://raw.githubusercontent.com/tomickigrzegorz/autocomplete/master/docs/characters.json";

type Character = { char_id: number; name: string; img: string; status: string };

async function fetchCharacters(): Promise<Character[]> {
  const res = await fetch(API);
  return res.json();
}

export default function App() {
  const [selected, setSelected] = useState<Character | null>(null);

  const onSearch = useCallback(
    async ({ currentValue }: { currentValue: string }) => {
      const data = await fetchCharacters();
      return data
        .sort((a, b) => a.name.localeCompare(b.name))
        .filter((el) => el.name.match(new RegExp(currentValue, "gi")));
    },
    [],
  );

  const onResults = useCallback(
    ({
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
        .join(""),
    [],
  );

  const onSubmit = useCallback(({ object }: { object: Character }) => {
    setSelected(object);
  }, []);

  return (
    <div className="container">
      <h1>
        <span className="badge">React</span> Autocomplete demo
      </h1>
      <p className="hint">Breaking Bad characters — type a name</p>

      <div className="auto-search-wrapper">
        <AutocompleteInput
          removeResultsWhenInputIsEmpty={true}
          onSearch={onSearch}
          onResults={onResults}
          onSubmit={onSubmit}
          placeholder="e.g. Walter"
          onLoading={({ element }) =>
            `<li>Loading results for: "${element.value}"...</li>`
          }
          noResults={({ element }) =>
            `<li>No results found: "${element.value}"</li>`
          }
        />
      </div>

      {selected && (
        <div className="selected-card">
          <img src={selected.img} alt={selected.name} />
          <div>
            <strong>{selected.name}</strong>
            <span>{selected.status}</span>
          </div>
        </div>
      )}
    </div>
  );
}
