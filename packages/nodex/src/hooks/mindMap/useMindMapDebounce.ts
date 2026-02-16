import { useEffect, useRef } from "react";

import { useMindMapState } from "../../state/mindMap";
import { getMindMapPreviewDataUrl } from "../../utils/getMindMapPreviewDataUrl";

type UseMindMapDebouncedChangeOptions = {
  delayMs?: number;
};

export function useMindMapDebounce(
  onChange: (
    nodes: ReturnType<typeof useMindMapState.getState>["nodes"],
    previewDataUrl: string | null,
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
      const nextNodes = latestNodesRef.current;
      const previewDataUrl = getMindMapPreviewDataUrl(nextNodes);
      callbackRef.current(nextNodes, previewDataUrl);
    }, delayMs);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [nodes, delayMs]);
}
