import { type MouseEvent } from "react";
import { useMindMapNode } from "./useMindMapNode";
import { useMindMapState } from "../../state/mindMap";

export function useMindMapNodeMouseHandlers(nodeId: string) {
  const { node } = useMindMapNode({ nodeId });
  const readOnly = useMindMapState((state) => state.readOnly);

  return {
    onMouseDown: (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      if (!readOnly) {
        node?.select();
      }
    },
    onDoubleClick: (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      if (!readOnly) {
        node?.select();
        node?.edit();
      }
    },
  };
}
