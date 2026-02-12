import { type MindMapNode, useMindMapState } from "../state/mindMap";

export const getNodeSide = (node: MindMapNode | null) => {
  const { getCentralNode } = useMindMapState.getState();

  const centralNode = getCentralNode();

  if (!node || node.type === "central" || !centralNode) {
    return "center";
  }

  const nodeCenterX = node.pos.x + node.style.w / 2;
  const centralCenterX = centralNode?.pos.x + centralNode.style.w / 2;

  return nodeCenterX < centralCenterX ? "left" : "right";
};
