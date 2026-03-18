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
  @Input() noResults?: AutocompleteOptions["noResults"];
  @Input() onSelectedItem?: AutocompleteOptions["onSelectedItem"];
  @Input() onLoading?: AutocompleteOptions["onLoading"];

  // optional config
  @Input() delay?: number;
  @Input() howManyCharacters?: number;
  @Input() clearButton?: boolean;
  @Input() selectFirst?: boolean;
  @Input() insertToInput?: boolean;
  @Input() showValuesOnClick?: boolean;
  @Input() cache?: boolean;
  @Input() inline?: boolean;
  @Input() classPrefix?: string;
  @Input() classGroup?: string;
  @Input() dropdownParent?: AutocompleteOptions["dropdownParent"];
  @Input() dropdownAttrs?: AutocompleteOptions["dropdownAttrs"];
  @Input() placeholder?: string;
  @Input() class?: string;

  private instance: Autocomplete | null = null;

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // re-create when onSearch changes after initial mount
    if (changes.onSearch && !changes.onSearch.firstChange) {
      this.instance?.destroy();
      this.init();
    }
  }

  ngOnDestroy(): void {
    this.instance?.destroy();
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
      ...(this.noResults && { noResults: this.noResults }),
      ...(this.onSelectedItem && { onSelectedItem: this.onSelectedItem }),
      ...(this.onLoading && { onLoading: this.onLoading }),
      ...(this.delay !== undefined && { delay: this.delay }),
      ...(this.howManyCharacters !== undefined && {
        howManyCharacters: this.howManyCharacters,
      }),
      ...(this.clearButton !== undefined && { clearButton: this.clearButton }),
      ...(this.selectFirst !== undefined && { selectFirst: this.selectFirst }),
      ...(this.insertToInput !== undefined && {
        insertToInput: this.insertToInput,
      }),
      ...(this.showValuesOnClick !== undefined && {
        showValuesOnClick: this.showValuesOnClick,
      }),
      ...(this.cache !== undefined && { cache: this.cache }),
      ...(this.inline !== undefined && { inline: this.inline }),
      ...(this.classPrefix && { classPrefix: this.classPrefix }),
      ...(this.classGroup && { classGroup: this.classGroup }),
      ...(this.dropdownParent !== undefined && {
        dropdownParent: this.dropdownParent,
      }),
      ...(this.dropdownAttrs !== undefined && {
        dropdownAttrs: this.dropdownAttrs,
      }),
    });
  }
}
