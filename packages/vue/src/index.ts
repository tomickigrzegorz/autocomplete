import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  h,
  type PropType,
} from "vue";
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

export const AutocompleteInput = defineComponent({
  name: "AutocompleteInput",

  props: {
    onSearch: {
      type: Function as PropType<AutocompleteOptions["onSearch"]>,
      required: true,
    },
    onResults: {
      type: Function as PropType<AutocompleteOptions["onResults"]>,
      default: undefined,
    },
    onSubmit: {
      type: Function as PropType<AutocompleteOptions["onSubmit"]>,
      default: undefined,
    },
    onReset: {
      type: Function as PropType<AutocompleteOptions["onReset"]>,
      default: undefined,
    },
    onOpened: {
      type: Function as PropType<AutocompleteOptions["onOpened"]>,
      default: undefined,
    },
    onClose: {
      type: Function as PropType<AutocompleteOptions["onClose"]>,
      default: undefined,
    },
    onRender: {
      type: Function as PropType<AutocompleteOptions["onRender"]>,
      default: undefined,
    },
    noResults: {
      type: Function as PropType<AutocompleteOptions["noResults"]>,
      default: undefined,
    },
    onSelectedItem: {
      type: Function as PropType<AutocompleteOptions["onSelectedItem"]>,
      default: undefined,
    },
    onLoading: {
      type: Function as PropType<AutocompleteOptions["onLoading"]>,
      default: undefined,
    },
    delay: { type: Number, default: undefined },
    howManyCharacters: { type: Number, default: undefined },
    clearButton: { type: Boolean, default: undefined },
    clearButtonOnInitial: { type: Boolean, default: undefined },
    selectFirst: { type: Boolean, default: undefined },
    insertToInput: { type: Boolean, default: undefined },
    showValuesOnClick: { type: Boolean, default: undefined },
    cache: { type: Boolean, default: undefined },
    inline: { type: Boolean, default: undefined },
    disableCloseOnSelect: { type: Boolean, default: undefined },
    preventScrollUp: { type: Boolean, default: undefined },
    removeResultsWhenInputIsEmpty: { type: Boolean, default: undefined },
    classPrefix: { type: String, default: undefined },
    classGroup: { type: String, default: undefined },
    classPreventClosing: { type: String, default: undefined },
    ariaLabelClear: { type: String, default: undefined },
    dropdownParent: {
      type: [String, Object] as PropType<AutocompleteOptions["dropdownParent"]>,
      default: undefined,
    },
    dropdownAttrs: {
      type: Object as PropType<AutocompleteOptions["dropdownAttrs"]>,
      default: undefined,
    },
    regex: {
      type: Object as PropType<AutocompleteOptions["regex"]>,
      default: undefined,
    },
    placeholder: { type: String, default: undefined },
    class: { type: String, default: undefined },
  },

  setup(props) {
    const inputRef = ref<HTMLInputElement | null>(null);
    let instance: Autocomplete | null = null;

    onMounted(() => {
      if (!inputRef.value) return;

      // callbacks delegate through the reactive props object, so the
      // instance always calls the latest prop without being re-created;
      // undefined values fall back to core defaults;
      // placeholder and class belong to the <input>, not to the core
      const {
        placeholder: _placeholder,
        class: _class,
        ...options
      } = props as Record<string, unknown>;
      for (const key of CALLBACK_KEYS) {
        options[key] = (...args: unknown[]) =>
          (props[key] as Callback | undefined)?.(...args);
      }

      instance = new Autocomplete(
        inputRef.value,
        options as unknown as AutocompleteOptions,
      );
    });

    // onBeforeUnmount — the input is still in the DOM here, and unmount()
    // removes the dropdown/clear-button nodes the instance created
    onBeforeUnmount(() => {
      instance?.unmount();
      instance = null;
    });

    return () =>
      h("input", {
        ref: inputRef,
        type: "text",
        placeholder: props.placeholder,
        class: props.class,
      });
  },
});

export default AutocompleteInput;
