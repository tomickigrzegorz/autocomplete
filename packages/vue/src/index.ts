import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  watch,
  h,
  PropType,
} from "vue";
import Autocomplete, { AutocompleteOptions } from "@tomickigrzegorz/autocomplete";

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
    selectFirst: { type: Boolean, default: undefined },
    insertToInput: { type: Boolean, default: undefined },
    showValuesOnClick: { type: Boolean, default: undefined },
    cache: { type: Boolean, default: undefined },
    inline: { type: Boolean, default: undefined },
    classPrefix: { type: String, default: undefined },
    classGroup: { type: String, default: undefined },
    placeholder: { type: String, default: undefined },
    class: { type: String, default: undefined },
  },

  setup(props) {
    const inputRef = ref<HTMLInputElement | null>(null);
    let instance: Autocomplete | null = null;

    function init() {
      if (!inputRef.value) return;
      instance = new Autocomplete(inputRef.value, {
        onSearch: props.onSearch,
        ...(props.onResults && { onResults: props.onResults }),
        ...(props.onSubmit && { onSubmit: props.onSubmit }),
        ...(props.onReset && { onReset: props.onReset }),
        ...(props.onOpened && { onOpened: props.onOpened }),
        ...(props.onClose && { onClose: props.onClose }),
        ...(props.noResults && { noResults: props.noResults }),
        ...(props.onSelectedItem && { onSelectedItem: props.onSelectedItem }),
        ...(props.onLoading && { onLoading: props.onLoading }),
        ...(props.delay !== undefined && { delay: props.delay }),
        ...(props.howManyCharacters !== undefined && { howManyCharacters: props.howManyCharacters }),
        ...(props.clearButton !== undefined && { clearButton: props.clearButton }),
        ...(props.selectFirst !== undefined && { selectFirst: props.selectFirst }),
        ...(props.insertToInput !== undefined && { insertToInput: props.insertToInput }),
        ...(props.showValuesOnClick !== undefined && { showValuesOnClick: props.showValuesOnClick }),
        ...(props.cache !== undefined && { cache: props.cache }),
        ...(props.inline !== undefined && { inline: props.inline }),
        ...(props.classPrefix && { classPrefix: props.classPrefix }),
        ...(props.classGroup && { classGroup: props.classGroup }),
      });
    }

    onMounted(init);

    // re-create when onSearch changes
    watch(() => props.onSearch, () => {
      instance?.destroy();
      init();
    });

    onUnmounted(() => {
      instance?.destroy();
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
