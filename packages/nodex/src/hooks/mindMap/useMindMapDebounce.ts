import { useEffect, useRef } from "react";

import { useMindMapState } from "../../state/mindMap";

type UseMindMapDebouncedChangeOptions = {
  delayMs?: number;
};

export function useMindMapDebounce(
  onChange: (
    nodes: ReturnType<typeof useMindMapState.getState>["nodes"],
  ) => void | Promise<void>,
  options: UseMindMapDebouncedChangeOptions = {},
) {
  const nodes = useMindMapState((state) => state.nodes);
  const delayMs = options.delayMs ?? 1500;
  const timeoutRef = useRef<number | null>(null);
  const latestNodesRef = useRef(nodes);
  const callbackRef = useRef(onChange);

  useEffect(() => {
    callbackRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    latestNodesRef.current = nodes;
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      callbackRef.current(latestNodesRef.current);
    }, delayMs);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [nodes, delayMs]);
}
