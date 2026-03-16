import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AutocompleteInput from "../src/index";

// mock core library
vi.mock("@tomickigrzegorz/autocomplete", () => {
  const destroy = vi.fn();
  const MockAutocomplete = vi.fn(() => ({ destroy }));
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

  it("initializes Autocomplete on mount with the input element", () => {
    render(<AutocompleteInput onSearch={mockSearch} onResults={mockResults} />);
    expect(Autocomplete).toHaveBeenCalledOnce();
    const [firstArg, secondArg] = (Autocomplete as any).mock.calls[0];
    expect(firstArg).toBeInstanceOf(HTMLInputElement);
    expect(secondArg.onSearch).toBe(mockSearch);
    expect(secondArg.onResults).toBe(mockResults);
  });

  it("calls destroy() on unmount", () => {
    const { unmount } = render(<AutocompleteInput onSearch={mockSearch} />);
    const instance = (Autocomplete as any).mock.results[0].value;
    unmount();
    expect(instance.destroy).toHaveBeenCalledOnce();
  });

  it("re-creates instance when onSearch changes", () => {
    const newSearch = vi.fn(async () => []);
    const { rerender } = render(<AutocompleteInput onSearch={mockSearch} />);
    expect(Autocomplete).toHaveBeenCalledTimes(1);
    rerender(<AutocompleteInput onSearch={newSearch} />);
    expect(Autocomplete).toHaveBeenCalledTimes(2);
  });

  it("input gets an auto-assigned id", () => {
    render(<AutocompleteInput onSearch={mockSearch} />);
    const input = screen.getByRole("textbox");
    expect(input.id).toBeTruthy();
  });
});
