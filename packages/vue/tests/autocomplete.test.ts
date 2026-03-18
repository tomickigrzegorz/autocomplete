import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import AutocompleteInput from "../src/index";

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

describe("AutocompleteInput (Vue)", () => {
  it("renders an input element", () => {
    const wrapper = mount(AutocompleteInput, {
      props: { onSearch: mockSearch },
    });
    expect(wrapper.find("input").exists()).toBe(true);
  });

  it("passes placeholder prop to input", () => {
    const wrapper = mount(AutocompleteInput, {
      props: { onSearch: mockSearch, placeholder: "Type here" },
    });
    expect(wrapper.find("input").attributes("placeholder")).toBe("Type here");
  });

  it("initializes Autocomplete on mount with HTMLInputElement", () => {
    mount(AutocompleteInput, {
      props: { onSearch: mockSearch, onResults: mockResults },
    });
    expect(Autocomplete).toHaveBeenCalledOnce();
    const [firstArg, secondArg] = (Autocomplete as any).mock.calls[0];
    expect(firstArg).toBeInstanceOf(HTMLInputElement);
    expect(secondArg.onSearch).toBe(mockSearch);
  });

  it("calls destroy() on unmount", () => {
    const wrapper = mount(AutocompleteInput, {
      props: { onSearch: mockSearch },
    });
    const instance = (Autocomplete as any).mock.results[0].value;
    wrapper.unmount();
    expect(instance.destroy).toHaveBeenCalledOnce();
  });

  it("re-creates instance when onSearch changes", async () => {
    const newSearch = vi.fn(async () => []);
    const wrapper = mount(AutocompleteInput, {
      props: { onSearch: mockSearch },
    });
    expect(Autocomplete).toHaveBeenCalledTimes(1);
    await wrapper.setProps({ onSearch: newSearch });
    expect(Autocomplete).toHaveBeenCalledTimes(2);
  });
});
