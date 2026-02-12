import { type MindMapNode, useMindMapState } from "../state/mindMap";

export const centerNode = (node: MindMapNode | null) => {
  if (!node) return;

  const { setOffset, scale } = useMindMapState.getState();

  const rootElement = document.querySelector(
    "[data-nodex-root]"
  ) as HTMLElement | null;
  const bounds = rootElement?.getBoundingClientRect();
  const viewportWidth = bounds?.width ?? window.innerWidth;
  const viewportHeight = bounds?.height ?? window.innerHeight;

  setOffset({
    x: viewportWidth / 2 - (node.pos.x + node.style.w / 2) * scale,
    y: viewportHeight / 2 - (node.pos.y + node.style.h / 2) * scale,
  });
};
