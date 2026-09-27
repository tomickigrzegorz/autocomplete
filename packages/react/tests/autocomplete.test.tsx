import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import AutocompleteInput from "../src/index";

// mock core library
vi.mock("@tomickigrzegorz/autocomplete", () => {
  const unmount = vi.fn();
  const MockAutocomplete = vi.fn(() => ({ unmount }));
  return { default: MockAutocomplete };
});

import Autocomplete from "@tomickigrzegorz/autocomplete";

const mockSearch = vi.fn(async () => []);
const mockResults = vi.fn(() => "");

beforeEach(() => {
  vi.clearAllMocks();
});

describe("AutocompleteInput (React)", () => {
  it("renders an input element", () => {
    render(<AutocompleteInput onSearch={mockSearch} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("passes placeholder prop to input", () => {
    render(<AutocompleteInput onSearch={mockSearch} placeholder="Type here" />);
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("passes className prop to input", () => {
    render(<AutocompleteInput onSearch={mockSearch} className="my-input" />);
    expect(screen.getByRole("textbox")).toHaveClass("my-input");
  });

  it("initializes Autocomplete on mount and delegates callbacks", () => {
    render(<AutocompleteInput onSearch={mockSearch} onResults={mockResults} />);
    expect(Autocomplete).toHaveBeenCalledOnce();
    const [firstArg, secondArg] = (Autocomplete as any).mock.calls[0];
    expect(firstArg).toBeInstanceOf(HTMLInputElement);
    secondArg.onSearch({ currentValue: "a" });
    expect(mockSearch).toHaveBeenCalledWith({ currentValue: "a" });
    secondArg.onResults({ matches: [] });
    expect(mockResults).toHaveBeenCalled();
  });

  it("calls unmount() on unmount", () => {
    const { unmount } = render(<AutocompleteInput onSearch={mockSearch} />);
    const instance = (Autocomplete as any).mock.results[0].value;
    unmount();
    expect(instance.unmount).toHaveBeenCalledOnce();
  });

  it("delegates to the latest onSearch without re-creating the instance", () => {
    const newSearch = vi.fn(async () => []);
    const { rerender } = render(<AutocompleteInput onSearch={mockSearch} />);
    expect(Autocomplete).toHaveBeenCalledTimes(1);
    rerender(<AutocompleteInput onSearch={newSearch} />);
    expect(Autocomplete).toHaveBeenCalledTimes(1);
    const [, secondArg] = (Autocomplete as any).mock.calls[0];
    secondArg.onSearch({ currentValue: "x" });
    expect(newSearch).toHaveBeenCalledWith({ currentValue: "x" });
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it("input gets an auto-assigned id", () => {
    render(<AutocompleteInput onSearch={mockSearch} />);
    const input = screen.getByRole("textbox");
    expect(input.id).toBeTruthy();
  });

  it("delegates a callback passed only after mount", () => {
    const onSubmit = vi.fn();
    const { rerender } = render(<AutocompleteInput onSearch={mockSearch} />);
    rerender(<AutocompleteInput onSearch={mockSearch} onSubmit={onSubmit} />);
    const [, secondArg] = (Autocomplete as any).mock.calls[0];
    secondArg.onSubmit({ index: 0 });
    expect(onSubmit).toHaveBeenCalledWith({ index: 0 });
  });
});
