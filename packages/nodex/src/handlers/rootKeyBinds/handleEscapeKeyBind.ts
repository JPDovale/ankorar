import { useMindMapState } from "../../state/mindMap";

export const handleEscapeKeyBind = () => {
  const {
    editingNodeId,
    findNode,
    removeNode,
    setSelectedNode,
    setEditingNode,
  } = useMindMapState.getState();

  setSelectedNode(null);
  const node = findNode(editingNodeId ?? "");

  if (!node) return;

  const textValue = node.text.trim();

  if (textValue.length === 0 && editingNodeId) {
    removeNode(editingNodeId);
  }

  setEditingNode(null);
};
