import { useEffect, useId, useRef } from "react";
import Autocomplete, { AutocompleteOptions } from "@tomickigrzegorz/autocomplete";

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
  const uid = useId();

  useEffect(() => {
    if (!ref.current) return;

    const instance = new Autocomplete(ref.current, options);
    return () => {
      instance.destroy();
    };
    // re-create instance when onSearch changes (e.g. new data source)
  }, [options.onSearch]);

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
