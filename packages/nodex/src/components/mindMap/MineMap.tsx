import { useEffect, useMemo, useState } from "react";
import type { MindMapNode } from "../../state/mindMap";
import { useMindMapState } from "../../state/mindMap";
import { useShallow } from "zustand/react/shallow";
import { cn } from "../../lib/utils";

const MAP_WIDTH = 200;
const MAP_HEIGHT = 120;
const MAP_PADDING = 8;

const collectVisibleNodes = (nodes: MindMapNode[]) => {
  const list: MindMapNode[] = [];
  const walk = (items: MindMapNode[]) => {
    for (const node of items) {
      if (!node.isVisible) {
        continue;
      }
      list.push(node);
      if (node.childrens.length) {
        walk(node.childrens);
      }
    }
  };
  walk(nodes);
  return list;
};

interface MineMapProps {
  className?: string;
}

export function MineMap({ className }: MineMapProps = {}) {
  const { nodes, offset, scale, zenMode } = useMindMapState(
    useShallow((state) => ({
      nodes: state.nodes,
      offset: state.offset,
      scale: state.scale,
      zenMode: state.zenMode,
    })),
  );
  const [rootSize, setRootSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const root = document.querySelector(
      "[data-nodex-root]",
    ) as HTMLElement | null;
    if (!root) {
      return;
    }
    const updateSize = () => {
      const bounds = root.getBoundingClientRect();
      setRootSize({ w: bounds.width, h: bounds.height });
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(root);
    return () => {
      observer.disconnect();
    };
  }, []);

  const { nodesToRender, viewportRect } = useMemo(() => {
    const visibleNodes = collectVisibleNodes(nodes);
    if (visibleNodes.length === 0) {
      return {
        viewBox: { minX: 0, minY: 0, maxX: 1, maxY: 1 },
        nodesToRender: [] as Array<{
          id: string;
          x: number;
          y: number;
          r: number;
          color: string;
        }>,
        viewportRect: null as null | {
          x: number;
          y: number;
          w: number;
          h: number;
        },
      };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of visibleNodes) {
      const wrapper = node.style.wrapperPadding * 2;
      const width = node.style.w + wrapper;
      const height = node.style.h + wrapper;
      minX = Math.min(minX, node.pos.x);
      minY = Math.min(minY, node.pos.y);
      maxX = Math.max(maxX, node.pos.x + width);
      maxY = Math.max(maxY, node.pos.y + height);
    }
    const boundsWidth = Math.max(1, maxX - minX);
    const boundsHeight = Math.max(1, maxY - minY);
    const scaleX = (MAP_WIDTH - MAP_PADDING * 2) / boundsWidth;
    const scaleY = (MAP_HEIGHT - MAP_PADDING * 2) / boundsHeight;
    const mapScale = Math.min(scaleX, scaleY) * 0.7;
    const centralNode = visibleNodes.find((node) => node.type === "central");
    const centralCenter = centralNode
      ? (() => {
          const wrapper = centralNode.style.wrapperPadding * 1.5;
          const width = centralNode.style.w + wrapper;
          const height = centralNode.style.h + wrapper;
          return {
            x: centralNode.pos.x + width / 2.5,
            y: centralNode.pos.y + height / 2.5,
          };
        })()
      : null;
    const originX = centralCenter
      ? centralCenter.x - (MAP_WIDTH / 2 - MAP_PADDING) / mapScale
      : minX;
    const originY = centralCenter
      ? centralCenter.y - (MAP_HEIGHT / 2 - MAP_PADDING) / mapScale
      : minY;

    const nodesToRender = visibleNodes.map((node) => {
      const wrapper = node.style.wrapperPadding * 1.5;
      const width = node.style.w + wrapper;
      const height = node.style.h + wrapper;
      const centerX = node.pos.x + width / 2.5;
      const centerY = node.pos.y + height / 2.5;
      return {
        id: node.id,
        x: (centerX - originX) * mapScale + MAP_PADDING,
        y: (centerY - originY) * mapScale + MAP_PADDING,
        r: node.type === "central" ? 3.5 : 2.5,
        color: node.style.color,
      };
    });

    const viewportRect =
      rootSize.w && rootSize.h
        ? {
            x: (-offset.x / scale - originX) * mapScale + MAP_PADDING,
            y: (-offset.y / scale - originY) * mapScale + MAP_PADDING,
            w: (rootSize.w / scale) * mapScale,
            h: (rootSize.h / scale) * mapScale,
          }
        : null;

    return {
      viewBox: { minX, minY, maxX, maxY },
      nodesToRender,
      viewportRect,
    };
  }, [nodes, offset, scale, rootSize.h, rootSize.w]);

  return (
    <div
      data-zen={zenMode}
      className={cn(
        "pointer-events-none absolute bottom-4 right-4 z-50 transition-all duration-150 rounded-xl border border-slate-200 bg-white/50 p-2 shadow-sm backdrop-blur data-[zen=true]:opacity-0 data-[zen=true]:scale-90 opacity-100 scale-100",
        className,
      )}
    >
      <svg
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        aria-hidden="true"
      >
        <rect
          x={0.5}
          y={0.5}
          width={MAP_WIDTH - 1}
          height={MAP_HEIGHT - 1}
          rx={10}
          fill="transparent"
          stroke="#e2e8f0"
        />
        {nodesToRender.map((node) => (
          <circle
            key={node.id}
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={node.color}
          />
        ))}
        {viewportRect && (
          <rect
            x={viewportRect.x}
            y={viewportRect.y}
            width={viewportRect.w}
            height={viewportRect.h}
            fill="transparent"
            stroke="#0f172a30"
            strokeWidth={1}
            rx={4}
          />
        )}
      </svg>
    </div>
  );
}
