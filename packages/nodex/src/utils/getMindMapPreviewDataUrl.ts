import type { MindMapNode } from "../state/mindMap";
import { useMindMapState } from "../state/mindMap";
import {
  getMineMapProjection,
  MINE_MAP_HEIGHT,
  MINE_MAP_WIDTH,
} from "../components/mindMap/MineMap";

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Builds the MineMap (minimap) SVG as a data URL for preview thumbnails.
 * Only the node circles, no viewport rect, transparent background.
 */
export function getMindMapPreviewDataUrl(nodes: MindMapNode[]): string | null {
  if (nodes.length === 0) return null;

  const state = useMindMapState.getState();
  const root = typeof document !== "undefined"
    ? document.querySelector<HTMLElement>("[data-nodex-root]")
    : null;
  const rootSize = root
    ? (() => {
        const r = root.getBoundingClientRect();
        return { w: r.width, h: r.height };
      })()
    : { w: 0, h: 0 };

  const { nodesToRender } = getMineMapProjection(
    nodes,
    state.offset,
    state.scale,
    rootSize,
  );

  if (nodesToRender.length === 0) return null;

  const circles = nodesToRender
    .map(
      (n) =>
        `<circle cx="${n.x}" cy="${n.y}" r="${n.r}" fill="${escapeXml(n.color)}"/>`,
    )
    .join("\n");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${MINE_MAP_WIDTH}" height="${MINE_MAP_HEIGHT}" viewBox="0 0 ${MINE_MAP_WIDTH} ${MINE_MAP_HEIGHT}">
  ${circles}
</svg>`;

  if (typeof btoa === "undefined") return null;
  const encoded = btoa(unescape(encodeURIComponent(svg)));
  return `data:image/svg+xml;base64,${encoded}`;
}
