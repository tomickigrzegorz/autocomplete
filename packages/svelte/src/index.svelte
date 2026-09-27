<script lang="ts">
import { untrack } from "svelte";
import Autocomplete, {
  type AutocompleteOptions,
} from "@tomickigrzegorz/autocomplete";

// every callback is delegated — also those passed only after mount
const CALLBACK_KEYS = [
  "onSearch",
  "onResults",
  "onSubmit",
  "onOpened",
  "onReset",
  "onRender",
  "onClose",
  "noResults",
  "onLoading",
  "onSelectedItem",
] as const;

type Callback = (...args: unknown[]) => unknown;

type Props = AutocompleteOptions & {
  class?: string;
  placeholder?: string;
};

const props: Props = $props();

let inputEl: HTMLInputElement;

$effect(() => {
  // untrack — the instance lives for the component lifetime; callbacks
  // delegate through the live rune props, so they always call the latest
  // prop without the instance being re-created
  const instance = untrack(() => {
    // placeholder and class belong to the <input>, not to the core
    const {
      class: _class,
      placeholder: _placeholder,
      ...options
    } = props as Record<string, unknown>;
    for (const key of CALLBACK_KEYS) {
      options[key] = (...args: unknown[]) =>
        (props[key] as Callback | undefined)?.(...args);
    }
    return new Autocomplete(inputEl, options as unknown as AutocompleteOptions);
  });

  return () => instance.unmount();
});
</script>

<input
  bind:this={inputEl}
  type="text"
  class={props.class}
  placeholder={props.placeholder}
/>
