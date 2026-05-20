<script lang="ts">
import { untrack } from "svelte";
import Autocomplete, {
  type AutocompleteOptions,
} from "@tomickigrzegorz/autocomplete";

type Props = AutocompleteOptions & {
  class?: string;
  placeholder?: string;
};

const {
  class: className,
  placeholder,
  onSearch,
  onResults,
  onSubmit,
  onReset,
  onOpened,
  onClose,
  onRender,
  noResults,
  onSelectedItem,
  onLoading,
  delay,
  howManyCharacters,
  clearButton,
  clearButtonOnInitial,
  selectFirst,
  insertToInput,
  showValuesOnClick,
  cache,
  inline,
  disableCloseOnSelect,
  preventScrollUp,
  removeResultsWhenInputIsEmpty,
  classPrefix,
  classGroup,
  classPreventClosing,
  ariaLabelClear,
  dropdownParent,
  dropdownAttrs,
  regex,
}: Props = $props();

let inputEl: HTMLInputElement;

$effect(() => {
  const search = onSearch; // track only onSearch — re-create when it changes

  const instance = untrack(
    () =>
      new Autocomplete(inputEl, {
        onSearch: search,
        ...(onResults && { onResults }),
        ...(onSubmit && { onSubmit }),
        ...(onReset && { onReset }),
        ...(onOpened && { onOpened }),
        ...(onClose && { onClose }),
        ...(onRender && { onRender }),
        ...(noResults && { noResults }),
        ...(onSelectedItem && { onSelectedItem }),
        ...(onLoading && { onLoading }),
        ...(delay !== undefined && { delay }),
        ...(howManyCharacters !== undefined && { howManyCharacters }),
        ...(clearButton !== undefined && { clearButton }),
        ...(clearButtonOnInitial !== undefined && { clearButtonOnInitial }),
        ...(selectFirst !== undefined && { selectFirst }),
        ...(insertToInput !== undefined && { insertToInput }),
        ...(showValuesOnClick !== undefined && { showValuesOnClick }),
        ...(cache !== undefined && { cache }),
        ...(inline !== undefined && { inline }),
        ...(disableCloseOnSelect !== undefined && { disableCloseOnSelect }),
        ...(preventScrollUp !== undefined && { preventScrollUp }),
        ...(removeResultsWhenInputIsEmpty !== undefined && {
          removeResultsWhenInputIsEmpty,
        }),
        ...(classPrefix && { classPrefix }),
        ...(classGroup && { classGroup }),
        ...(classPreventClosing && { classPreventClosing }),
        ...(ariaLabelClear && { ariaLabelClear }),
        ...(dropdownParent !== undefined && { dropdownParent }),
        ...(dropdownAttrs !== undefined && { dropdownAttrs }),
        ...(regex !== undefined && { regex }),
      }),
  );

  return () => {
    // resultWrap is the input's next sibling when no dropdownParent is set;
    // destroy() doesn't remove it in that case, so we remove it manually
    // to avoid orphaned elements when the instance is re-created.
    const resultWrap = inputEl?.nextElementSibling;
    instance.destroy();
    resultWrap?.remove();
  };
});
</script>

<input
  bind:this={inputEl}
  type="text"
  class={className}
  {placeholder}
/>
