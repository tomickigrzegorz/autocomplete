import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AutocompleteComponent } from "../lib/autocomplete.component";

jest.mock("@tomickigrzegorz/autocomplete", () => {
  const destroy = jest.fn();
  const MockAutocomplete = jest.fn(() => ({ destroy }));
  return { default: MockAutocomplete };
});

import Autocomplete from "@tomickigrzegorz/autocomplete";

const mockSearch = jest.fn(async () => []);

describe("AutocompleteComponent (Angular)", () => {
  let fixture: ComponentFixture<AutocompleteComponent>;
  let component: AutocompleteComponent;

  beforeEach(async () => {
    jest.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [AutocompleteComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    component.onSearch = mockSearch;
  });

  it("renders an input element", () => {
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input");
    expect(input).toBeTruthy();
  });

  it("passes placeholder to input", () => {
    component.placeholder = "Type here";
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector("input");
    expect(input.placeholder).toBe("Type here");
  });

  it("initializes Autocomplete after view init with HTMLInputElement", () => {
    fixture.detectChanges(); // triggers ngAfterViewInit
    expect(Autocomplete).toHaveBeenCalledTimes(1);
    const [firstArg, secondArg] = (Autocomplete as any).mock.calls[0];
    expect(firstArg).toBeInstanceOf(HTMLInputElement);
    expect(secondArg.onSearch).toBe(mockSearch);
  });

  it("calls destroy() on component destroy", () => {
    fixture.detectChanges();
    const instance = (Autocomplete as any).mock.results[0].value;
    fixture.destroy();
    expect(instance.destroy).toHaveBeenCalledTimes(1);
  });

  it("re-creates instance when onSearch input changes", () => {
    fixture.detectChanges();
    const newSearch = jest.fn(async () => []);
    component.onSearch = newSearch;
    // simulate ngOnChanges
    component.ngOnChanges({
      onSearch: { currentValue: newSearch, previousValue: mockSearch, firstChange: false, isFirstChange: () => false },
    });
    expect(Autocomplete).toHaveBeenCalledTimes(2);
  });
});
