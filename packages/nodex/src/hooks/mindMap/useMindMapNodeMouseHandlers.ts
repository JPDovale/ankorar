import { type MouseEvent } from "react";
import { useMindMapNode } from "./useMindMapNode";

export function useMindMapNodeMouseHandlers(nodeId: string) {
  const { node } = useMindMapNode({ nodeId });

  return {
    onMouseDown: (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      node?.select();
    },
    onDoubleClick: (event: MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      node?.select();
      node?.edit();
    },
  };
}
