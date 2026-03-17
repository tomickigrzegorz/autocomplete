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
  const uid = useId().replace(/:/g, "");
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!ref.current) return;

    const instance = new Autocomplete(ref.current, optionsRef.current);

    return () => {
      // remove the resultWrap from DOM before destroying to prevent orphaned elements
      const resultWrap = ref.current?.nextElementSibling;
      instance.destroy();
      resultWrap?.remove();
    };
  }, [options.onSearch]); // re-create when onSearch changes

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
