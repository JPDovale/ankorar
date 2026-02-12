import { useMindMapState } from "../../state/mindMap";

export const handleTransformNodeKeyBind = (
  transformation: ("bold" | "italic" | "image")[],
) => {
  const {
    getCentralNode,
    findNode,
    updateNode,
    setSelectedNode,
    setEditingNode,
    selectedNodeId,
  } = useMindMapState.getState();

  const centralNode = getCentralNode();
  const node = findNode(selectedNodeId ?? centralNode?.id ?? "");

  if (!node) return;

  if (transformation.includes("bold")) {
    node.style.isBold = !node.style.isBold;
  }

  if (transformation.includes("italic")) {
    node.style.isItalic = !node.style.isItalic;
  }

  if (transformation.includes("image")) {
    node.style.isBold = false;
    node.style.isItalic = false;
    node.text = "";
    node.type = "image";

    setSelectedNode(node.id);
    setEditingNode(node.id);
  }

  updateNode(node);
};
