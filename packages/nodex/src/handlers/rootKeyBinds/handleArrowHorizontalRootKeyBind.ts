import { centerNode } from "../../helpers/centerNode";
import { getNodeSide } from "../../helpers/getNodeSide";
import { useMindMapState } from "../../state/mindMap";

export const handleArrowHorizontalRootKeyBind = (dir: "left" | "right") => {
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
  const currentSide = getNodeSide(node);

  const shouldGoParent =
    (dir === "right" && currentSide === "left") ||
    (dir === "left" && currentSide === "right");

  if (shouldGoParent) {
    const parent = findNodeParent(node.id);

    if (parent) {
      setSelectedNode(parent.id);
      centerNode(parent);
    }

    return;
  }

  const visibleChildren = node.childrens
    .filter((child) => child.isVisible)
    .filter((child) => getNodeSide(child) === dir)
    .sort((a, b) => a.sequence - b.sequence);

  const target = visibleChildren[0];

  if (target) {
    setSelectedNode(target.id);
    centerNode(target);
  }
};
