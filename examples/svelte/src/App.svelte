<script lang="ts">
  import AutocompleteInput from "@tomickigrzegorz/autocomplete-svelte";
  import "@tomickigrzegorz/autocomplete/css";

  const API =
    "https://raw.githubusercontent.com/tomickigrzegorz/autocomplete/master/docs/characters.json";

  type Character = { char_id: number; name: string; img: string; status: string };

  let selected = $state<Character | null>(null);

  async function onSearch({ currentValue }: { currentValue: string }) {
    const res = await fetch(API);
    const data: Character[] = await res.json();
    return data
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((el) => el.name.match(new RegExp(currentValue, "gi")));
  }

  function onResults({
    currentValue,
    matches,
  }: {
    currentValue: string;
    matches: Character[];
  }) {
    return matches
      .map(
        (el) => `
        <li>
          <img src="${el.img}" alt="${el.name}" width="32" height="32" />
          <p>${el.name.replace(new RegExp(currentValue, "gi"), (s) => `<b>${s}</b>`)}</p>
          <small>${el.status}</small>
        </li>`,
      )
      .join("");
  }

  function onSubmit({ object }: { object: Character }) {
    selected = object;
  }
</script>

<div class="container">
  <h1>
    <span class="badge">Svelte</span> Autocomplete demo
  </h1>
  <p class="hint">Breaking Bad characters — type a name</p>

  <div class="auto-search-wrapper">
    <AutocompleteInput
      {onSearch}
      {onResults}
      {onSubmit}
      placeholder="e.g. Walter"
    />
  </div>

  {#if selected}
    <div class="selected-card">
      <img src={selected.img} alt={selected.name} />
      <div>
        <strong>{selected.name}</strong>
        <span>{selected.status}</span>
      </div>
    </div>
  {/if}
</div>

<style>
  :global(*), :global(*::before), :global(*::after) { box-sizing: border-box; }

  :global(body) {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    background: #f5f5f5;
    margin: 0;
    padding: 40px 16px;
  }

  .container { max-width: 480px; margin: 0 auto; }

  h1 {
    font-size: 1.5rem;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .badge {
    background: #ff3e00;
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;
  }

  .hint { color: #666; font-size: 0.9rem; margin-bottom: 20px; }

  :global(.auto-search-wrapper) { position: relative; }

  :global(.auto-search-wrapper input) {
    width: 100%;
    padding: 10px 14px;
    font-size: 1rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s;
  }

  :global(.auto-search-wrapper input:focus) { border-color: #ff3e00; }

  .selected-card {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 20px;
    padding: 14px;
    background: #fff;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .selected-card img { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; }
  .selected-card div { display: flex; flex-direction: column; gap: 2px; }
  .selected-card strong { font-size: 1rem; }
  .selected-card span { font-size: 0.85rem; color: #666; }

  :global(.auto-search-wrapper ul li) {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
  }

  :global(.auto-search-wrapper ul li img) { border-radius: 50%; object-fit: cover; }
  :global(.auto-search-wrapper ul li p) { margin: 0; flex: 1; }
  :global(.auto-search-wrapper ul li small) { color: #888; font-size: 0.78rem; }
</style>
