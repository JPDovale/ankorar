import { centerNode } from "../../helpers/centerNode";
import { useMindMapState } from "../../state/mindMap";

export const handleArrowVerticalRootKeyBind = (dir: "up" | "down") => {
  const {
    selectedNodeId,
    getCentralNode,
    setSelectedNode,
    findNode,
    findNodeParent,
  } = useMindMapState.getState();

  const centralNode = getCentralNode();
  const node = findNode(selectedNodeId ?? centralNode?.id ?? "");

  if (!node) return;

  if (node.type === "central") {
    centerNode(node);
    return;
  }

  const parent = findNodeParent(node.id);
  if (!parent) return;

  const siblings = parent.childrens
    .filter((child) => child.isVisible)
    .sort((a, b) => a.sequence - b.sequence);

  const currentIndex = siblings.findIndex((child) => child.id === node.id);
  const step = dir === "down" ? 1 : -1;
  const siblingTarget = siblings[currentIndex + step];

  if (siblingTarget) {
    setSelectedNode(siblingTarget.id);
    centerNode(siblingTarget);
    return;
  }

  if (!siblingTarget && parent) {
    setSelectedNode(parent.id);
    centerNode(parent);
  }
};
