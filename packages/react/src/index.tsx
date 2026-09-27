import { useEffect, useId, useRef } from "react";
import Autocomplete, {
  type AutocompleteOptions,
} from "@tomickigrzegorz/autocomplete";

// every callback is delegated — also those passed only after mount
const CALLBACK_KEYS = [
  "onSearch",
  "onResults",
  "onSubmit",
  "onOpened",
  "onReset",
  "onRender",
  "onClose",
  "noResults",
  "onLoading",
  "onSelectedItem",
] as const;

type Callback = (...args: unknown[]) => unknown;

export type AutocompleteProps = AutocompleteOptions & {
  className?: string;
  placeholder?: string;
  "aria-label"?: string;
};

export function AutocompleteInput({
  className,
  placeholder,
  "aria-label": ariaLabel,
  ...options
}: AutocompleteProps) {
  const ref = useRef<HTMLInputElement>(null);
  // strip characters invalid in id/attribute names (React 17/18 ":r0:", React 19 "«r0»")
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // empty deps — the instance lives for the component lifetime
  useEffect(() => {
    if (!ref.current) return;

    // callbacks delegate through optionsRef, so the instance always calls
    // the latest props without being destroyed and re-created on re-renders
    const liveOptions: Record<string, unknown> = { ...optionsRef.current };
    for (const key of CALLBACK_KEYS) {
      liveOptions[key] = (...args: unknown[]) =>
        (optionsRef.current[key] as Callback | undefined)?.(...args);
    }

    const instance = new Autocomplete(
      ref.current,
      liveOptions as unknown as AutocompleteOptions,
    );

    return () => instance.unmount();
  }, []);

  return (
    <input
      ref={ref}
      id={uid}
      type="text"
      className={className}
      placeholder={placeholder}
      aria-label={ariaLabel}
    />
  );
}

export default AutocompleteInput;
