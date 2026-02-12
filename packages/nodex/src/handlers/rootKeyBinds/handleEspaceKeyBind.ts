import { useMindMapState } from "../../state/mindMap";

export const handleEspaceKeyBind = () => {
  const { selectedNodeId, findNode, setEditingNode } =
    useMindMapState.getState();

  const node = findNode(selectedNodeId ?? "");
  if (!node) return;

  setEditingNode(selectedNodeId);
};
