import { useEffect, useRef } from "react";

/**
 * A hook that logs the number of times a component has rendered.
 *
 * @param componentName The name of the component.
 * @returns The number of times the component has rendered.
 */
export default function useRenderCount(componentName: string) {
  const renderCount = useRef<number>(0);

  useEffect(() => {
    console.log(`${componentName} rendered: ${++renderCount.current}`);
  });

  return renderCount.current;
}
