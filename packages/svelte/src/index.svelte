<script lang="ts">
  import { untrack } from "svelte";
  import Autocomplete, { type AutocompleteOptions } from "@tomickigrzegorz/autocomplete";

  type Props = AutocompleteOptions & {
    class?: string;
    placeholder?: string;
  };

  let {
    class: className,
    placeholder,
    onSearch,
    onResults,
    onSubmit,
    onReset,
    onOpened,
    onClose,
    noResults,
    onSelectedItem,
    onLoading,
    delay,
    howManyCharacters,
    clearButton,
    selectFirst,
    insertToInput,
    showValuesOnClick,
    cache,
    inline,
    classPrefix,
    classGroup,
    dropdownParent,
    dropdownAttrs,
  }: Props = $props();

  let inputEl: HTMLInputElement;

  $effect(() => {
    const search = onSearch; // track only onSearch — re-create when it changes

    const instance = untrack(() =>
      new Autocomplete(inputEl, {
        onSearch: search,
        ...(onResults && { onResults }),
        ...(onSubmit && { onSubmit }),
        ...(onReset && { onReset }),
        ...(onOpened && { onOpened }),
        ...(onClose && { onClose }),
        ...(noResults && { noResults }),
        ...(onSelectedItem && { onSelectedItem }),
        ...(onLoading && { onLoading }),
        ...(delay !== undefined && { delay }),
        ...(howManyCharacters !== undefined && { howManyCharacters }),
        ...(clearButton !== undefined && { clearButton }),
        ...(selectFirst !== undefined && { selectFirst }),
        ...(insertToInput !== undefined && { insertToInput }),
        ...(showValuesOnClick !== undefined && { showValuesOnClick }),
        ...(cache !== undefined && { cache }),
        ...(inline !== undefined && { inline }),
        ...(classPrefix && { classPrefix }),
        ...(classGroup && { classGroup }),
        ...(dropdownParent !== undefined && { dropdownParent }),
        ...(dropdownAttrs !== undefined && { dropdownAttrs }),
      })
    );

    return () => instance.destroy();
  });
</script>

<input
  bind:this={inputEl}
  type="text"
  class={className}
  {placeholder}
/>
