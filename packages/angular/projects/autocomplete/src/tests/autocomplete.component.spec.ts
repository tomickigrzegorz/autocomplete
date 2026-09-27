import { PLATFORM_ID } from "@angular/core";
import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { AutocompleteComponent } from "../lib/autocomplete.component";

jest.mock("@tomickigrzegorz/autocomplete", () => {
  const unmount = jest.fn();
  const MockAutocomplete = jest.fn(() => ({ unmount }));
  return { __esModule: true, default: MockAutocomplete };
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

  it("initializes Autocomplete after view init and delegates callbacks", () => {
    fixture.detectChanges(); // triggers ngAfterViewInit
    expect(Autocomplete).toHaveBeenCalledTimes(1);
    const [firstArg, secondArg] = (Autocomplete as any).mock.calls[0];
    expect(firstArg).toBeInstanceOf(HTMLInputElement);
    secondArg.onSearch({ currentValue: "a" });
    expect(mockSearch).toHaveBeenCalledWith({ currentValue: "a" });
  });

  it("calls unmount() on component destroy", () => {
    fixture.detectChanges();
    const instance = (Autocomplete as any).mock.results[0].value;
    fixture.destroy();
    expect(instance.unmount).toHaveBeenCalledTimes(1);
  });

  it("delegates to the latest onSearch without re-creating the instance", () => {
    fixture.detectChanges();
    const newSearch = jest.fn(async () => []);
    component.onSearch = newSearch;
    expect(Autocomplete).toHaveBeenCalledTimes(1);
    const [, secondArg] = (Autocomplete as any).mock.calls[0];
    secondArg.onSearch({ currentValue: "x" });
    expect(newSearch).toHaveBeenCalledWith({ currentValue: "x" });
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it("delegates a callback passed only after init", () => {
    fixture.detectChanges();
    const onSubmit = jest.fn();
    component.onSubmit = onSubmit;
    const [, secondArg] = (Autocomplete as any).mock.calls[0];
    secondArg.onSubmit({ index: 0 });
    expect(onSubmit).toHaveBeenCalledWith({ index: 0 });
  });

  it("does not initialize Autocomplete on the server (SSR)", () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [AutocompleteComponent],
      providers: [{ provide: PLATFORM_ID, useValue: "server" }],
    });
    const serverFixture = TestBed.createComponent(AutocompleteComponent);
    serverFixture.componentInstance.onSearch = mockSearch;
    serverFixture.detectChanges();
    expect(Autocomplete).not.toHaveBeenCalled();
    expect(() => serverFixture.destroy()).not.toThrow();
  });
});
