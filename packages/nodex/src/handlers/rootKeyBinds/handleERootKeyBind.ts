import { useMindMapState } from "../../state/mindMap";

export const handleERootKeyBind = () => {
  const { findNode, selectedNodeId, updateNode } = useMindMapState.getState();

  const node = findNode(selectedNodeId ?? "");

  if (!node) return;

  node.childrens = node.childrens.map((child) => ({
    ...child,
    isVisible: !child.isVisible,
  }));

  updateNode(node);
};
