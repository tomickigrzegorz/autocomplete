import { isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  PLATFORM_ID,
  type ElementRef,
  ViewChild,
  inject,
  type AfterViewInit,
  type OnDestroy,
} from "@angular/core";
import Autocomplete, {
  type AutocompleteOptions,
} from "@tomickigrzegorz/autocomplete";

// every callback is delegated — also those passed only after init
const CALLBACK_KEYS = [
  "onSearch",
  "onResults",
  "onSubmit",
  "onReset",
  "onOpened",
  "onClose",
  "onRender",
  "noResults",
  "onSelectedItem",
  "onLoading",
] as const;

const CONFIG_KEYS = [
  "delay",
  "howManyCharacters",
  "clearButton",
  "clearButtonOnInitial",
  "selectFirst",
  "insertToInput",
  "showValuesOnClick",
  "cache",
  "inline",
  "disableCloseOnSelect",
  "preventScrollUp",
  "removeResultsWhenInputIsEmpty",
  "classPrefix",
  "classGroup",
  "classPreventClosing",
  "ariaLabelClear",
  "dropdownParent",
  "dropdownAttrs",
  "regex",
] as const;

type Callback = (...args: unknown[]) => unknown;

@Component({
  selector: "ngx-autocomplete",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<input #inputEl type="text" [class]="class" [placeholder]="placeholder || ''" />`,
})
export class AutocompleteComponent implements AfterViewInit, OnDestroy {
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
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngAfterViewInit(): void {
    // the core needs a real DOM — skip on the server (SSR)
    if (!this.isBrowser || !this.inputEl?.nativeElement) return;

    // callbacks delegate through the component instance, so updated
    // @Input callbacks are picked up without re-creating the autocomplete;
    // undefined values fall back to core defaults
    const self = this as unknown as Record<string, unknown>;
    const options: Record<string, unknown> = {};
    for (const key of CONFIG_KEYS) {
      options[key] = self[key];
    }
    for (const key of CALLBACK_KEYS) {
      options[key] = (...args: unknown[]) =>
        (self[key] as Callback | undefined)?.(...args);
    }

    this.instance = new Autocomplete(
      this.inputEl.nativeElement,
      options as unknown as AutocompleteOptions,
    );
  }

  ngOnDestroy(): void {
    this.instance?.unmount();
    this.instance = null;
  }
}
