import { useMindMapState } from "../../state/mindMap";

export const handleBackEspaceKeyBind = () => {
  const { selectedNodeId, findNode, setSelectedNode, removeNode } =
    useMindMapState.getState();

  const node = findNode(selectedNodeId ?? "");
  if (!node) return;

  setSelectedNode(null);
  removeNode(node.id);
};
