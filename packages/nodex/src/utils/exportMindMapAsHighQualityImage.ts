import type { MindMapNode } from "../state/mindMap";
import {
  getNodesBounds,
  getNodeWrapper,
  getSegmentLines,
  type SegmentLine,
} from "../components/mindMap/Segments";

const DEFAULT_FONT_FAMILY = '"Geist", "Inter", system-ui, sans-serif';
const SEGMENT_STROKE_WIDTH = 6;
const LINE_HEIGHT_FACTOR = 1.15;

/** Pixel scale factor for export (2–4). Higher = larger image and sharper text when zooming. */
export const HIGH_QUALITY_EXPORT_SCALE = 3;

/** Padding around the map content in the exported image (in logical pixels). */
const EXPORT_PADDING = 48;

/**
 * Browser canvas size limits (~16k per side / ~268M pixels in Chrome). We cap dimensions
 * so large maps still export: we reduce scale automatically when needed.
 */
const MAX_CANVAS_DIMENSION = 16384;

/** Collects all visible nodes from the tree (depth-first). */
function getFlatVisibleNodes(nodes: MindMapNode[]): MindMapNode[] {
  const out: MindMapNode[] = [];
  function walk(list: MindMapNode[]) {
    for (const node of list) {
      if (!node.isVisible) continue;
      out.push(node);
      walk(node.childrens);
    }
  }
  walk(nodes);
  return out;
}

function getNodeFontWeight(node: MindMapNode): number {
  if (!node.style.isBold) return 400;
  return node.type === "central" ? 700 : 600;
}

/**
 * Splits node text into lines that fit within maxWidth using canvas measureText.
 */
function getTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number,
  fontWeight: number,
  isItalic: boolean,
): string[] {
  if (!text.trim()) return [""];
  const font = `${isItalic ? "italic" : "normal"} ${fontWeight} ${fontSize}px ${DEFAULT_FONT_FAMILY}`;
  ctx.font = font;
  const lines: string[] = [];
  const paragraphs = text.split("\n");
  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = words[0];
    for (let i = 1; i < words.length; i++) {
      const next = `${current} ${words[i]}`;
      const m = ctx.measureText(next);
      const w = m.actualBoundingBoxRight !== undefined
        ? m.actualBoundingBoxLeft + m.actualBoundingBoxRight
        : m.width;
      if (w <= maxWidth) {
        current = next;
      } else {
        lines.push(current);
        current = words[i];
      }
    }
    if (current) lines.push(current);
  }
  return lines.length ? lines : [""];
}

function drawSegment(
  ctx: CanvasRenderingContext2D,
  seg: SegmentLine,
): void {
  ctx.beginPath();
  ctx.moveTo(seg.start.x, seg.start.y);
  ctx.bezierCurveTo(
    seg.controlStart.x,
    seg.controlStart.y,
    seg.controlEnd.x,
    seg.controlEnd.y,
    seg.end.x,
    seg.end.y,
  );
  ctx.strokeStyle = seg.color;
  ctx.lineWidth = SEGMENT_STROKE_WIDTH;
  ctx.lineCap = "round";
  ctx.stroke();
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: MindMapNode,
): void {
  const w = getNodeWrapper(node);
  const x = w.left;
  const y = w.top;
  const width = w.width;
  const height = w.height;
  const innerX = x + node.style.wrapperPadding;
  const innerY = y + node.style.wrapperPadding;
  const innerW = node.style.w;
  const innerH = node.style.h;
  const radius = node.type === "central" ? Math.min(innerW, innerH) / 2 : 12;

  if (node.type === "central") {
    const cx = innerX + innerW / 2;
    const cy = innerY + innerH / 2;
    const r = Math.min(innerW, innerH) / 2;
    ctx.fillStyle = "transparent";
    ctx.strokeStyle = node.style.color || "#94a3b8";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = node.style.backgroundColor || "transparent";
    ctx.strokeStyle = node.style.color || "#94a3b8";
    ctx.lineWidth = 1;
    roundRect(ctx, innerX, innerY, innerW, innerH, radius);
    ctx.fill();
    ctx.stroke();
  }

  const fontWeight = getNodeFontWeight(node);
  const fontSize = node.style.fontSize;
  const isItalic = node.style.isItalic;
  const textColor = node.style.textColor || "#0f172a";
  const align = node.style.textAlign;
  const paddingX = node.style.padding.x;
  const paddingY = node.style.padding.y;
  const textAreaW = innerW - paddingX * 2;
  const textAreaH = innerH - paddingY * 2;

  if (node.type === "image") {
    const label = node.text.trim()
      ? (node.text.length > 40 ? node.text.slice(0, 37) + "…" : node.text)
      : "[imagem]";
    ctx.fillStyle = "#64748b";
    ctx.font = `${fontSize}px ${DEFAULT_FONT_FAMILY}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      label,
      innerX + innerW / 2,
      innerY + innerH / 2,
    );
    return;
  }

  const lines = getTextLines(
    ctx,
    node.text,
    textAreaW,
    fontSize,
    fontWeight,
    isItalic,
  );
  const lineHeight = Math.ceil(fontSize * LINE_HEIGHT_FACTOR);
  ctx.font = `${isItalic ? "italic" : "normal"} ${fontWeight} ${fontSize}px ${DEFAULT_FONT_FAMILY}`;
  ctx.fillStyle = textColor;
  ctx.textBaseline = "top";

  const totalTextHeight = lines.length * lineHeight;
  let startY = innerY + paddingY;
  if (lines.length > 1 && totalTextHeight < textAreaH) {
    const blockOffset = (textAreaH - totalTextHeight) / 2;
    if (align === "center") startY += blockOffset;
  }

  for (let i = 0; i < lines.length; i++) {
    const lineY = startY + i * lineHeight;
    let textX: number;
    if (align === "center") {
      textX = innerX + innerW / 2;
      ctx.textAlign = "center";
    } else if (align === "right") {
      textX = innerX + innerW - paddingX;
      ctx.textAlign = "right";
    } else {
      textX = innerX + paddingX;
      ctx.textAlign = "left";
    }
    ctx.fillText(lines[i], textX, lineY, textAreaW);
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  if (r <= 0) {
    ctx.rect(x, y, w, h);
    return;
  }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export type ExportImageOptions = {
  /** Scale factor (default: HIGH_QUALITY_EXPORT_SCALE). Higher = larger file, sharper when zooming. */
  scale?: number;
  /** Optional filename for download (without extension). */
  filename?: string;
};

export type CreateMindMapCanvasOptions = {
  scale?: number;
};

/**
 * Renders the mind map to a canvas and returns it (for PNG export or PDF). Returns null if no visible nodes or canvas unavailable.
 */
export function createMindMapExportCanvas(
  nodes: MindMapNode[],
  options: CreateMindMapCanvasOptions = {},
): HTMLCanvasElement | null {
  const scale = Math.min(4, Math.max(1, options.scale ?? HIGH_QUALITY_EXPORT_SCALE));
  const flat = getFlatVisibleNodes(nodes);
  if (flat.length === 0) return null;

  const bounds = getNodesBounds(nodes);
  if (!bounds) return null;

  const padding = EXPORT_PADDING;
  const contentW = bounds.maxX - bounds.minX + padding * 2;
  const contentH = bounds.maxY - bounds.minY + padding * 2;

  const maxScaleByW = contentW > 0 ? MAX_CANVAS_DIMENSION / contentW : scale;
  const maxScaleByH = contentH > 0 ? MAX_CANVAS_DIMENSION / contentH : scale;
  const effectiveScale = Math.min(scale, maxScaleByW, maxScaleByH);
  const canvasW = Math.min(
    MAX_CANVAS_DIMENSION,
    Math.ceil(contentW * effectiveScale),
  );
  const canvasH = Math.min(
    MAX_CANVAS_DIMENSION,
    Math.ceil(contentH * effectiveScale),
  );

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, 0, canvasW, canvasH);

  ctx.save();
  ctx.scale(effectiveScale, effectiveScale);
  ctx.translate(-bounds.minX + padding, -bounds.minY + padding);

  const segmentLines = getSegmentLines(nodes);
  for (const seg of segmentLines) drawSegment(ctx, seg);
  for (const node of flat) drawNode(ctx, node);

  ctx.restore();
  return canvas;
}

/**
 * Renders the current mind map to a high-resolution PNG and triggers a download.
 * Uses a scale factor so that zooming into the image keeps text readable even on very large maps.
 * Must be called in a browser environment with the mind map already mounted.
 */
export function exportMindMapAsHighQualityImage(
  nodes: MindMapNode[],
  options: ExportImageOptions = {},
): Promise<void> {
  const filename = options.filename ?? `mind-map-${Date.now()}`;
  const canvas = createMindMapExportCanvas(nodes, {
    scale: options.scale,
  });
  if (!canvas) return Promise.resolve();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create image blob"));
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${filename}.png`;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      },
      "image/png",
      1,
    );
  });
}
