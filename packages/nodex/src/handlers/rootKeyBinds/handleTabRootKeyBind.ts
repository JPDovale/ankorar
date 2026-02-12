import { useMindMapState } from "../../state/mindMap";

export const handleTabRootKeyBind = () => {
  const {
    editingNodeId,
    selectedNodeId,
    findNode,
    getCentralNode,
    removeNode,
    updateNode,
    makeChildNode,
    setEditingNode,
    setSelectedNode,
  } = useMindMapState.getState();

  const isEditing = !!editingNodeId;
  const nodeEditing = findNode(editingNodeId ?? "");
  const centralNode = getCentralNode();
  const currentNode = findNode(selectedNodeId ?? centralNode?.id ?? "");

  if (isEditing && nodeEditing) {
    const textValue = nodeEditing.text.trim();

    if (textValue.length === 0) {
      removeNode(editingNodeId);
      return;
    }

    return;
  }

  if (!currentNode) {
    return;
  }

  const newNode = currentNode;

  if (currentNode.childrens.some((child) => !child.isVisible)) {
    newNode.childrens = currentNode.childrens.map((child) => ({
      ...child,
      isVisible: true,
    }));
  }

  const newChildNode = makeChildNode(newNode);
  newNode.childrens.push(newChildNode);

  updateNode(newNode);
  setSelectedNode(newChildNode.id);
  setEditingNode(newChildNode.id);
};
