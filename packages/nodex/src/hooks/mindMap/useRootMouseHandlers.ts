import type {
  MouseEvent,
  RefObject,
  WheelEvent as WheelReactEvent,
} from "react";
import { useEffect, useRef, useState } from "react";

import { useMindMapState } from "../../state/mindMap";
import { useShallow } from "zustand/react/shallow";

interface UseRootMouseHandlersProps {
  rootRef: RefObject<HTMLDivElement | null>;
}

export function useRootMouseHandlers({ rootRef }: UseRootMouseHandlersProps) {
  const {
    offset,
    scale,
    clampScale,
    setScale,
    setOffset,
    setSelectedNode,
    setEditingNode,
    selectedNodeId,
    helpOpen,
  } = useMindMapState(
    useShallow((state) => ({
      offset: state.offset,
      scale: state.scale,
      clampScale: state.clampScale,
      setScale: state.setScale,
      setOffset: state.setOffset,
      setSelectedNode: state.setSelectedNode,
      setEditingNode: state.setEditingNode,
      selectedNodeId: state.selectedNodeId,
      helpOpen: state.helpOpen,
    })),
  );
  const isDraggingRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const offsetStartRef = useRef({ x: 0, y: 0 });

  const onWheel = (event: WheelReactEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (helpOpen) return;
    const zoomSpeed = event.ctrlKey ? 0.0005 : 0.0005;
    const zoomDelta = -event.deltaY * zoomSpeed;
    const nextScale = clampScale(scale + zoomDelta);
    if (nextScale === scale) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const pointerX = event.clientX - bounds.left;
    const pointerY = event.clientY - bounds.top;
    const worldX = (pointerX - offset.x) / scale;
    const worldY = (pointerY - offset.y) / scale;
    const nextOffset = {
      x: pointerX - worldX * nextScale,
      y: pointerY - worldY * nextScale,
    };
    setScale(nextScale);
    setOffset(nextOffset);
  };

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;

    const handleWheel = (event: WheelEvent) => {
      const e = event as unknown as WheelReactEvent<HTMLDivElement>;
      onWheel(e);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [onWheel]);

  return {
    isDragging,
    onMouseDown: (event: MouseEvent<HTMLDivElement>) => {
      const target = event.target as Element | null;
      const clickedNode = target?.closest?.("[data-nodex-node]");
      const clickedUi = target?.closest?.("[data-nodex-ui]");
      if (selectedNodeId && !clickedNode && !clickedUi) {
        setSelectedNode(null);
        setEditingNode(null);
      }
      if (clickedNode || clickedUi) {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      isDraggingRef.current = true;
      setIsDragging(true);
      dragStartRef.current = { x: event.clientX, y: event.clientY };
      offsetStartRef.current = { x: offset.x, y: offset.y };
    },
    onMouseMove: (event: MouseEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) {
        return;
      }
      const deltaX = event.clientX - dragStartRef.current.x;
      const deltaY = event.clientY - dragStartRef.current.y;
      setOffset({
        x: offsetStartRef.current.x + deltaX,
        y: offsetStartRef.current.y + deltaY,
      });
    },
    onMouseUp: () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    },
    onMouseLeave: () => {
      isDraggingRef.current = false;
      setIsDragging(false);
    },
    onWheel,
  };
}
