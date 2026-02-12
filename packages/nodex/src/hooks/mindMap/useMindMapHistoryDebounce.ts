import { useEffect, useRef } from "react";

import {
  type MindMapSnapshot,
  createMindMapSnapshot,
  useMindMapHistory,
} from "../../state/mindMapHistory";
import { useMindMapState } from "../../state/mindMap";
import { useMindMapDebounce } from "./useMindMapDebounce";

type UseMindMapHistoryDebounceOptions = {
  delayMs?: number;
};

export function useMindMapHistoryDebounce(
  options: UseMindMapHistoryDebounceOptions = {},
) {
  const delayMs = options.delayMs ?? 3000;
  const nodes = useMindMapState((state) => state.nodes);
  const lastSnapshotRef = useRef<MindMapSnapshot | null>(null);
  const pendingSnapshotRef = useRef<MindMapSnapshot | null>(null);

  useEffect(() => {
    const state = useMindMapState.getState();
    const currentSnapshot = createMindMapSnapshot({
      nodes: state.nodes,
      selectedNodeId: state.selectedNodeId,
      editingNodeId: state.editingNodeId,
      offset: state.offset,
      scale: state.scale,
    });

    if (!lastSnapshotRef.current) {
      lastSnapshotRef.current = currentSnapshot;
      return;
    }

    if (!pendingSnapshotRef.current) {
      pendingSnapshotRef.current = lastSnapshotRef.current;
    }

    lastSnapshotRef.current = currentSnapshot;
  }, [nodes]);

  useMindMapDebounce(
    () => {
      const pendingSnapshot = pendingSnapshotRef.current;
      if (!pendingSnapshot) {
        return;
      }
      useMindMapHistory.getState().pushSnapshot(pendingSnapshot);
      pendingSnapshotRef.current = null;
    },
    { delayMs },
  );
}
