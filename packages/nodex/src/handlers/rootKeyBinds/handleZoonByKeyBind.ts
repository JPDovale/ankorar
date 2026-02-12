import { useMindMapState } from "../../state/mindMap";

export const handleZoomByKeyBind = (delta: number) => {
  const { clampScale, setScale, setOffset, scale, offset } =
    useMindMapState.getState();
  const rootElement = document.querySelector(
    "[data-nodex-root]",
  ) as HTMLElement | null;

  const bounds = rootElement?.getBoundingClientRect();

  const viewportWidth = bounds?.width ?? window.innerWidth;
  const viewportHeight = bounds?.height ?? window.innerHeight;

  const pointerX = viewportWidth / 2;
  const pointerY = viewportHeight / 2;

  const nextScale = clampScale(scale + delta);

  if (nextScale === scale) {
    return;
  }
  const worldX = (pointerX - offset.x) / scale;
  const worldY = (pointerY - offset.y) / scale;

  setScale(nextScale);
  setOffset({
    x: pointerX - worldX * nextScale,
    y: pointerY - worldY * nextScale,
  });
};
