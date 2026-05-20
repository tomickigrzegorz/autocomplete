import {
  Component,
  Input,
  type ElementRef,
  ViewChild,
  type AfterViewInit,
  type OnDestroy,
  type OnChanges,
  type SimpleChanges,
} from "@angular/core";
import Autocomplete, {
  type AutocompleteOptions,
} from "@tomickigrzegorz/autocomplete";

@Component({
  selector: "ngx-autocomplete",
  standalone: true,
  template: `<input #inputEl type="text" [class]="class" [placeholder]="placeholder || ''" />`,
})
export class AutocompleteComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild("inputEl") inputEl!: ElementRef<HTMLInputElement>;

  // required
  @Input({ required: true }) onSearch!: AutocompleteOptions["onSearch"];

  // optional callbacks
  @Input() onResults?: AutocompleteOptions["onResults"];
  @Input() onSubmit?: AutocompleteOptions["onSubmit"];
  @Input() onReset?: AutocompleteOptions["onReset"];
  @Input() onOpened?: AutocompleteOptions["onOpened"];
  @Input() onClose?: AutocompleteOptions["onClose"];
  @Input() onRender?: AutocompleteOptions["onRender"];
  @Input() noResults?: AutocompleteOptions["noResults"];
  @Input() onSelectedItem?: AutocompleteOptions["onSelectedItem"];
  @Input() onLoading?: AutocompleteOptions["onLoading"];

  // optional config
  @Input() delay?: number;
  @Input() howManyCharacters?: number;
  @Input() clearButton?: boolean;
  @Input() clearButtonOnInitial?: boolean;
  @Input() selectFirst?: boolean;
  @Input() insertToInput?: boolean;
  @Input() showValuesOnClick?: boolean;
  @Input() cache?: boolean;
  @Input() inline?: boolean;
  @Input() disableCloseOnSelect?: boolean;
  @Input() preventScrollUp?: boolean;
  @Input() removeResultsWhenInputIsEmpty?: boolean;
  @Input() classPrefix?: string;
  @Input() classGroup?: string;
  @Input() classPreventClosing?: string;
  @Input() ariaLabelClear?: string;
  @Input() dropdownParent?: AutocompleteOptions["dropdownParent"];
  @Input() dropdownAttrs?: AutocompleteOptions["dropdownAttrs"];
  @Input() regex?: AutocompleteOptions["regex"];
  @Input() placeholder?: string;
  @Input() class?: string;

  private instance: Autocomplete | null = null;

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // re-create when onSearch changes after initial mount
    if (changes.onSearch && !changes.onSearch.firstChange) {
      this.cleanup();
      this.init();
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private cleanup(): void {
    // resultWrap is the input's next sibling when no dropdownParent is set;
    // destroy() doesn't remove it in that case, so we remove it manually
    // to avoid orphaned elements when the instance is re-created.
    const resultWrap = this.inputEl?.nativeElement?.nextElementSibling;
    this.instance?.destroy();
    resultWrap?.remove();
    this.instance = null;
  }

  private init(): void {
    if (!this.inputEl?.nativeElement) return;
    this.instance = new Autocomplete(this.inputEl.nativeElement, {
      onSearch: this.onSearch,
      ...(this.onResults && { onResults: this.onResults }),
      ...(this.onSubmit && { onSubmit: this.onSubmit }),
      ...(this.onReset && { onReset: this.onReset }),
      ...(this.onOpened && { onOpened: this.onOpened }),
      ...(this.onClose && { onClose: this.onClose }),
      ...(this.onRender && { onRender: this.onRender }),
      ...(this.noResults && { noResults: this.noResults }),
      ...(this.onSelectedItem && { onSelectedItem: this.onSelectedItem }),
      ...(this.onLoading && { onLoading: this.onLoading }),
      ...(this.delay !== undefined && { delay: this.delay }),
      ...(this.howManyCharacters !== undefined && {
        howManyCharacters: this.howManyCharacters,
      }),
      ...(this.clearButton !== undefined && { clearButton: this.clearButton }),
      ...(this.clearButtonOnInitial !== undefined && {
        clearButtonOnInitial: this.clearButtonOnInitial,
      }),
      ...(this.selectFirst !== undefined && { selectFirst: this.selectFirst }),
      ...(this.insertToInput !== undefined && {
        insertToInput: this.insertToInput,
      }),
      ...(this.showValuesOnClick !== undefined && {
        showValuesOnClick: this.showValuesOnClick,
      }),
      ...(this.cache !== undefined && { cache: this.cache }),
      ...(this.inline !== undefined && { inline: this.inline }),
      ...(this.disableCloseOnSelect !== undefined && {
        disableCloseOnSelect: this.disableCloseOnSelect,
      }),
      ...(this.preventScrollUp !== undefined && {
        preventScrollUp: this.preventScrollUp,
      }),
      ...(this.removeResultsWhenInputIsEmpty !== undefined && {
        removeResultsWhenInputIsEmpty: this.removeResultsWhenInputIsEmpty,
      }),
      ...(this.classPrefix && { classPrefix: this.classPrefix }),
      ...(this.classGroup && { classGroup: this.classGroup }),
      ...(this.classPreventClosing && {
        classPreventClosing: this.classPreventClosing,
      }),
      ...(this.ariaLabelClear && { ariaLabelClear: this.ariaLabelClear }),
      ...(this.dropdownParent !== undefined && {
        dropdownParent: this.dropdownParent,
      }),
      ...(this.dropdownAttrs !== undefined && {
        dropdownAttrs: this.dropdownAttrs,
      }),
      ...(this.regex !== undefined && { regex: this.regex }),
    });
  }
}
