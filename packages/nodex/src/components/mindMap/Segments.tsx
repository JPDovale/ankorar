import { useMemo } from "react";
import type { MindMapNode } from "../../state/mindMap";
import { cn } from "../../lib/utils";

interface SegmentsProps {
  nodes: MindMapNode[];
  className?: string;
}

type Point = {
  x: number;
  y: number;
};

export type SegmentLine = {
  key: string;
  start: Point;
  end: Point;
  controlStart: Point;
  controlEnd: Point;
  color: string;
};

const TOGGLE_EDGE_OUTSIDE_OFFSET = 6;

export function getNodeWrapper(node: MindMapNode) {
  const wrapperPadding = node.style.wrapperPadding;

  return {
    left: node.pos.x,
    top: node.pos.y,
    width: node.style.w + wrapperPadding * 2,
    height: node.style.h + wrapperPadding * 2,
  };
}

function getNodeCenter(node: MindMapNode): Point {
  const wrapper = getNodeWrapper(node);

  return {
    x: wrapper.left + wrapper.width / 2,
    y: wrapper.top + wrapper.height / 2,
  };
}

function getNodeAnchor(node: MindMapNode, side: "left" | "right"): Point {
  const wrapper = getNodeWrapper(node);

  return {
    x: side === "right" ? wrapper.left + wrapper.width : wrapper.left,
    y: wrapper.top + wrapper.height / 2,
  };
}

function findCentralNode(nodes: MindMapNode[]): MindMapNode | null {
  let centralNode: MindMapNode | null = null;

  const walk = (node: MindMapNode) => {
    if (centralNode) {
      return;
    }

    if (node.type === "central") {
      centralNode = node;
      return;
    }

    for (const child of node.childrens) {
      walk(child);
    }
  };

  for (const node of nodes) {
    walk(node);
  }

  return centralNode;
}

function getBranchSide(
  node: MindMapNode,
  centralCenterX: number | null,
): "left" | "right" | null {
  if (centralCenterX === null || node.type === "central") {
    return null;
  }

  return getNodeCenter(node).x < centralCenterX ? "left" : "right";
}

function getOutputAnchor(node: MindMapNode, side: "left" | "right"): Point {
  if (node.type === "central") {
    return {
      x:
        node.pos.x +
        node.style.wrapperPadding +
        (side === "right" ? node.style.w : 0),
      y: node.pos.y + node.style.wrapperPadding + node.style.h / 2,
    };
  }

  const wrapper = getNodeWrapper(node);
  const hasChildren = node.childrens.length > 0;

  if (!hasChildren) {
    return getNodeAnchor(node, side);
  }

  return {
    x:
      side === "right"
        ? wrapper.left + wrapper.width + TOGGLE_EDGE_OUTSIDE_OFFSET
        : wrapper.left - TOGGLE_EDGE_OUTSIDE_OFFSET,
    y: wrapper.top + wrapper.height / 2,
  };
}

function getInputAnchor(node: MindMapNode, side: "left" | "right"): Point {
  if (node.type === "central") {
    return {
      x:
        node.pos.x +
        node.style.wrapperPadding +
        (side === "right" ? 0 : node.style.w),
      y: node.pos.y + node.style.wrapperPadding + node.style.h / 2,
    };
  }

  const wrapper = getNodeWrapper(node);

  return {
    x: side === "right" ? wrapper.left + 1 : wrapper.left + wrapper.width - 1,
    y: wrapper.top + wrapper.height / 2 + 0.5,
  };
}

function buildSegmentLine(
  fromNode: MindMapNode,
  toNode: MindMapNode,
  centralCenterX: number | null,
): SegmentLine | null {
  const fromCenter = getNodeCenter(fromNode);
  const toCenter = getNodeCenter(toNode);
  const branchSide =
    getBranchSide(toNode, centralCenterX) ??
    (toCenter.x >= fromCenter.x ? "right" : "left");
  const oppositeSide = branchSide === "right" ? "left" : "right";

  const start = getOutputAnchor(fromNode, branchSide);
  const end = getInputAnchor(toNode, branchSide);

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);

  if (length === 0) {
    return null;
  }

  const horizontalDistance = Math.abs(dx);
  const verticalDistance = Math.abs(dy);
  const direction = dx >= 0 ? 1 : -1;
  const baseHandle = Math.min(120, Math.max(32, horizontalDistance * 0.45));
  const verticalAdjustment = Math.min(28, verticalDistance * 0.2);
  const handleSize = baseHandle + verticalAdjustment;

  const controlStart = {
    x: start.x + direction * handleSize,
    y: start.y,
  };
  const controlEnd = {
    x: end.x + (oppositeSide === "right" ? handleSize : -handleSize),
    y: end.y,
  };

  return {
    key: `${fromNode.id}-${toNode.id}`,
    start,
    end,
    controlStart,
    controlEnd,
    color: toNode.style.color ?? fromNode.style.color ?? "#94a3b8",
  };
}

function collectVisibleEdges(
  parent: MindMapNode,
  edges: Array<{ from: MindMapNode; to: MindMapNode }>,
) {
  if (!parent.isVisible) {
    return;
  }

  for (const child of parent.childrens) {
    if (!child.isVisible) {
      continue;
    }

    edges.push({ from: parent, to: child });
    collectVisibleEdges(child, edges);
  }
}

export function getSegmentLines(nodes: MindMapNode[]): SegmentLine[] {
  const edges: Array<{ from: MindMapNode; to: MindMapNode }> = [];
  const centralNode = findCentralNode(nodes);
  const centralCenterX = centralNode ? getNodeCenter(centralNode).x : null;

  for (const node of nodes) {
    collectVisibleEdges(node, edges);
  }

  return edges
    .map(({ from, to }) => buildSegmentLine(from, to, centralCenterX))
    .filter((segment): segment is SegmentLine => Boolean(segment));
}

export function getNodesBounds(nodes: MindMapNode[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} | null {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let hasVisible = false;

  const walk = (node: MindMapNode) => {
    if (!node.isVisible) return;
    hasVisible = true;
    const w = getNodeWrapper(node);
    minX = Math.min(minX, w.left);
    minY = Math.min(minY, w.top);
    maxX = Math.max(maxX, w.left + w.width);
    maxY = Math.max(maxY, w.top + w.height);
    node.childrens.forEach(walk);
  };
  nodes.forEach(walk);

  if (!hasVisible) return null;
  return { minX, minY, maxX, maxY };
}

export function Segments({ nodes, className }: SegmentsProps) {
  const segmentLines = useMemo(
    () => getSegmentLines(nodes),
    [nodes],
  );

  return (
    <svg
      className={cn(
        "absolute left-0 top-0 h-full w-full pointer-events-none overflow-visible",
        className,
      )}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      {segmentLines.map((segment) => (
        <path
          key={segment.key}
          d={`M ${segment.start.x} ${segment.start.y} C ${segment.controlStart.x} ${segment.controlStart.y}, ${segment.controlEnd.x} ${segment.controlEnd.y}, ${segment.end.x} ${segment.end.y}`}
          fill="none"
          stroke={segment.color}
          strokeWidth="6"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
