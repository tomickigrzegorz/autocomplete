import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  watch,
  h,
  type PropType,
} from "vue";
import Autocomplete, {
  type AutocompleteOptions,
} from "@tomickigrzegorz/autocomplete";

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

    function cleanup() {
      // resultWrap is the input's next sibling when no dropdownParent is set;
      // destroy() doesn't remove it in that case, so we remove it manually
      // to avoid orphaned elements when the instance is re-created.
      const resultWrap = inputRef.value?.nextElementSibling;
      instance?.destroy();
      resultWrap?.remove();
      instance = null;
    }

    function init() {
      if (!inputRef.value) return;
      instance = new Autocomplete(inputRef.value, {
        onSearch: props.onSearch,
        ...(props.onResults && { onResults: props.onResults }),
        ...(props.onSubmit && { onSubmit: props.onSubmit }),
        ...(props.onReset && { onReset: props.onReset }),
        ...(props.onOpened && { onOpened: props.onOpened }),
        ...(props.onClose && { onClose: props.onClose }),
        ...(props.onRender && { onRender: props.onRender }),
        ...(props.noResults && { noResults: props.noResults }),
        ...(props.onSelectedItem && { onSelectedItem: props.onSelectedItem }),
        ...(props.onLoading && { onLoading: props.onLoading }),
        ...(props.delay !== undefined && { delay: props.delay }),
        ...(props.howManyCharacters !== undefined && {
          howManyCharacters: props.howManyCharacters,
        }),
        ...(props.clearButton !== undefined && {
          clearButton: props.clearButton,
        }),
        ...(props.clearButtonOnInitial !== undefined && {
          clearButtonOnInitial: props.clearButtonOnInitial,
        }),
        ...(props.selectFirst !== undefined && {
          selectFirst: props.selectFirst,
        }),
        ...(props.insertToInput !== undefined && {
          insertToInput: props.insertToInput,
        }),
        ...(props.showValuesOnClick !== undefined && {
          showValuesOnClick: props.showValuesOnClick,
        }),
        ...(props.cache !== undefined && { cache: props.cache }),
        ...(props.inline !== undefined && { inline: props.inline }),
        ...(props.disableCloseOnSelect !== undefined && {
          disableCloseOnSelect: props.disableCloseOnSelect,
        }),
        ...(props.preventScrollUp !== undefined && {
          preventScrollUp: props.preventScrollUp,
        }),
        ...(props.removeResultsWhenInputIsEmpty !== undefined && {
          removeResultsWhenInputIsEmpty: props.removeResultsWhenInputIsEmpty,
        }),
        ...(props.classPrefix && { classPrefix: props.classPrefix }),
        ...(props.classGroup && { classGroup: props.classGroup }),
        ...(props.classPreventClosing && {
          classPreventClosing: props.classPreventClosing,
        }),
        ...(props.ariaLabelClear && { ariaLabelClear: props.ariaLabelClear }),
        ...(props.dropdownParent !== undefined && {
          dropdownParent: props.dropdownParent,
        }),
        ...(props.dropdownAttrs !== undefined && {
          dropdownAttrs: props.dropdownAttrs,
        }),
        ...(props.regex !== undefined && { regex: props.regex }),
      });
    }

    onMounted(init);

    // re-create when onSearch changes
    watch(
      () => props.onSearch,
      () => {
        cleanup();
        init();
      },
    );

    onUnmounted(cleanup);

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
