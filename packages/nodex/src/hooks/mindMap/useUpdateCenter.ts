import { useMindMapState } from "../../state/mindMap";
import { type RefObject, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { useMindMapNode } from "./useMindMapNode";
import { useHelpers } from "./useHelpers";

interface UseUpdateCenterProps {
  rootRef: RefObject<HTMLDivElement | null>;
}

export function useUpdateCenter({ rootRef }: UseUpdateCenterProps) {
  const helpers = useHelpers();
  const { getCentralNode, setOffset, editingNodeId } = useMindMapState(
    useShallow((state) => ({
      getCentralNode: state.getCentralNode,
      setOffset: state.setOffset,
      editingNodeId: state.editingNodeId,
    }))
  );

  const { node } = useMindMapNode({ nodeId: editingNodeId });

  useEffect(() => {
    if (node && node.text === "") {
      helpers.centerNode(node);
    }
  }, [node]);

  useEffect(() => {
    const updateCenter = () => {
      const element = rootRef.current;
      if (!element) return;

      const centralNode = getCentralNode();
      if (!centralNode) return;

      const centralPos = centralNode.pos;
      const centralSize = centralNode.style;
      const bounds = element.getBoundingClientRect();

      setOffset({
        x: bounds.width / 2 - (centralPos.x + centralSize.w / 2),
        y: bounds.height / 2 - (centralPos.y + centralSize.h / 2),
      });
    };

    updateCenter();
    window.addEventListener("resize", updateCenter);

    return () => {
      window.removeEventListener("resize", updateCenter);
    };
  }, [setOffset]);
}
