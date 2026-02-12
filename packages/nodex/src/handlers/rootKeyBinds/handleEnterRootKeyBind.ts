import { useMindMapState } from "../../state/mindMap";

export const handleEnterRootKeyBind = () => {
  const {
    findNode,
    getCentralNode,
    findNodeParent,
    makeChildNode,
    updateNode,
    setEditingNode,
    setSelectedNode,
    selectedNodeId,
  } = useMindMapState.getState();

  const centralNode = getCentralNode();
  const node = findNode(selectedNodeId ?? centralNode?.id ?? "");

  if (!node) return;

  const parent = findNodeParent(node.id);
  if (!parent) return;

  const newNode = makeChildNode(parent);
  parent?.childrens.push(newNode);

  const textValue = node.text.trim();

  if (textValue.length === 0 && selectedNodeId) {
    parent.childrens = parent.childrens.filter((child) => child.id !== node.id);
  }

  updateNode(parent);
  setSelectedNode(newNode.id);
  setEditingNode(newNode.id);
};
