import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import AutocompleteInput from "../src/index";

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

  it("initializes Autocomplete on mount and delegates callbacks", () => {
    mount(AutocompleteInput, {
      props: { onSearch: mockSearch, onResults: mockResults },
    });
    expect(Autocomplete).toHaveBeenCalledOnce();
    const [firstArg, secondArg] = (Autocomplete as any).mock.calls[0];
    expect(firstArg).toBeInstanceOf(HTMLInputElement);
    secondArg.onSearch({ currentValue: "a" });
    expect(mockSearch).toHaveBeenCalledWith({ currentValue: "a" });
  });

  it("calls unmount() on unmount", () => {
    const wrapper = mount(AutocompleteInput, {
      props: { onSearch: mockSearch },
    });
    const instance = (Autocomplete as any).mock.results[0].value;
    wrapper.unmount();
    expect(instance.unmount).toHaveBeenCalledOnce();
  });

  it("delegates to the latest onSearch without re-creating the instance", async () => {
    const newSearch = vi.fn(async () => []);
    const wrapper = mount(AutocompleteInput, {
      props: { onSearch: mockSearch },
    });
    expect(Autocomplete).toHaveBeenCalledTimes(1);
    await wrapper.setProps({ onSearch: newSearch });
    expect(Autocomplete).toHaveBeenCalledTimes(1);
    const [, secondArg] = (Autocomplete as any).mock.calls[0];
    secondArg.onSearch({ currentValue: "x" });
    expect(newSearch).toHaveBeenCalledWith({ currentValue: "x" });
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it("delegates a callback passed only after mount", async () => {
    const onSubmit = vi.fn();
    const wrapper = mount(AutocompleteInput, {
      props: { onSearch: mockSearch },
    });
    await wrapper.setProps({ onSubmit });
    const [, secondArg] = (Autocomplete as any).mock.calls[0];
    secondArg.onSubmit({ index: 0 });
    expect(onSubmit).toHaveBeenCalledWith({ index: 0 });
  });
});
