import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/svelte";
import AutocompleteInput from "../src/index.svelte";

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

describe("AutocompleteInput (Svelte)", () => {
  it("renders an input element", () => {
    render(AutocompleteInput, { props: { onSearch: mockSearch } });
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("passes placeholder prop to input", () => {
    render(AutocompleteInput, {
      props: { onSearch: mockSearch, placeholder: "Type here" },
    });
    expect(screen.getByPlaceholderText("Type here")).toBeInTheDocument();
  });

  it("initializes Autocomplete on mount with HTMLInputElement", () => {
    render(AutocompleteInput, {
      props: { onSearch: mockSearch, onResults: mockResults },
    });
    expect(Autocomplete).toHaveBeenCalledOnce();
    const [firstArg, secondArg] = (Autocomplete as any).mock.calls[0];
    expect(firstArg).toBeInstanceOf(HTMLInputElement);
    expect(secondArg.onSearch).toBe(mockSearch);
  });

  it("calls destroy() on unmount", () => {
    const { unmount } = render(AutocompleteInput, {
      props: { onSearch: mockSearch },
    });
    const instance = (Autocomplete as any).mock.results[0].value;
    unmount();
    expect(instance.destroy).toHaveBeenCalledOnce();
  });

  it("re-creates instance when onSearch changes", async () => {
    const newSearch = vi.fn(async () => []);
    const { rerender } = render(AutocompleteInput, {
      props: { onSearch: mockSearch },
    });
    expect(Autocomplete).toHaveBeenCalledTimes(1);
    await rerender({ props: { onSearch: newSearch } });
    expect(Autocomplete).toHaveBeenCalledTimes(2);
  });
});
