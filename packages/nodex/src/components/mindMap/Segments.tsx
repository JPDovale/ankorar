import { useMemo } from "react";
import type { MindMapNode } from "../../state/mindMap";
import { cn } from "../../lib/utils";

interface SegmentsProps {
  nodes: MindMapNode[];
  className?: string;
}

export function Segments({ nodes, className }: SegmentsProps) {
  const segmentLines = useMemo(() => {
    type SegmentLine = {
      key: string;
      start: { x: number; y: number };
      end: { x: number; y: number };
      control: { x: number; y: number };
      color: string;
    };
    const gapFrom = 7;
    const gapTo = 0;
    const edges: Array<{ from: MindMapNode; to: MindMapNode }> = [];

    const collectEdges = (parent: MindMapNode) => {
      if (!parent.isVisible) {
        return;
      }
      for (const child of parent.childrens) {
        if (!child.isVisible) {
          continue;
        }
        edges.push({ from: parent, to: child });
        collectEdges(child);
      }
    };

    for (const node of nodes) {
      collectEdges(node);
    }

    const allNodes: MindMapNode[] = [];
    const collectNodes = (parent: MindMapNode) => {
      allNodes.push(parent);
      for (const child of parent.childrens) {
        collectNodes(child);
      }
    };
    for (const node of nodes) {
      collectNodes(node);
    }
    const centralNode = allNodes.find((node) => node.type === "central");
    const centralCenter = centralNode
      ? {
          x: centralNode.pos.x + centralNode.style.w / 2,
          y: centralNode.pos.y + centralNode.style.h / 2,
        }
      : null;

    return edges
      .map(({ from: fromNode, to: toNode }): SegmentLine | null => {
        const fromPad = fromNode.style.wrapperPadding;
        const toPad = toNode.style.wrapperPadding;
        const fromWrapper = {
          w: fromNode.style.w + fromPad * 2,
          h: fromNode.style.h + fromPad * 2,
        };
        const toWrapper = {
          w: toNode.style.w + toPad * 2,
          h: toNode.style.h + toPad * 2,
        };
        const fromCenter = {
          x: fromNode.pos.x + fromWrapper.w / 2,
          y: fromNode.pos.y + fromWrapper.h / 2,
        };
        const toCenter = {
          x: toNode.pos.x + toWrapper.w / 2,
          y: toNode.pos.y + toWrapper.h / 2,
        };

        const fromAnchor = {
          x:
            toCenter.x >= fromCenter.x
              ? fromNode.pos.x + fromWrapper.w
              : fromNode.pos.x,
          y: fromNode.pos.y + fromWrapper.h / 2,
        };
        const toAnchor =
          toNode.type === "central"
            ? {
                x: toNode.pos.x + toPad + toNode.style.w / 2,
                y: toNode.pos.y + toPad + toNode.style.h / 2,
              }
            : {
                x:
                  centralCenter && toCenter.x < centralCenter.x
                    ? toNode.pos.x + toWrapper.w
                    : toNode.pos.x,
                y: toNode.pos.y + toWrapper.h / 2,
              };

        const dx = toAnchor.x - fromAnchor.x;
        const dy = toAnchor.y - fromAnchor.y;
        const length = Math.hypot(dx, dy);
        if (length === 0) {
          return null;
        }

        const dir = { x: dx / length, y: dy / length };

        const start = {
          x: fromAnchor.x + dir.x * gapFrom,
          y: fromAnchor.y + dir.y * gapFrom,
        };
        const end = {
          x: toAnchor.x - dir.x * gapTo,
          y: toAnchor.y - dir.y * gapTo,
        };

        const curve = Math.min(40, Math.abs(dy) * 0.2 + 6);
        const control = {
          x: (start.x + end.x) / 2,
          y: (start.y + end.y) / 2 + Math.sign(dy || 1) * curve,
        };

        return {
          key: `${fromNode.id}-${toNode.id}`,
          start,
          end,
          control,
          color: toNode.style.color ?? fromNode.style.color ?? "#94a3b8",
        };
      })
      .filter((segment): segment is SegmentLine => Boolean(segment));
  }, [nodes]);

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
          d={`M ${segment.start.x} ${segment.start.y} Q ${segment.control.x} ${segment.control.y} ${segment.end.x} ${segment.end.y}`}
          fill="none"
          stroke={segment.color}
          strokeWidth="6"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}
