import React from "react";

/**
 * A custom hook that debounces a value.
 *
 * This hook delays the updating of the `debouncedValue` state until after
 * a specified delay has passed since the last time the value was changed.
 * This is useful for preventing excessive updates to a value, such as
 * input fields or search queries, during rapid changes.
 *
 * @template T
 * @param {T} value - The value to debounce.
 * @param {number} delay - The number of milliseconds to delay updating the
 * debounced value.
 * @returns {T} The debounced value.
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
