import { create } from "zustand";

import type { MindMapNode, MindMapPos } from "./mindMap";

export type MindMapSnapshot = {
  nodes: MindMapNode[];
  selectedNodeId: string | null;
  editingNodeId: string | null;
  offset: MindMapPos;
  scale: number;
};

type MindMapHistoryState = {
  past: MindMapSnapshot[];
  future: MindMapSnapshot[];
  pushSnapshot: (snapshot: MindMapSnapshot) => void;
  undo: (
    current: MindMapSnapshot,
    apply: (snapshot: MindMapSnapshot) => void
  ) => void;
  redo: (
    current: MindMapSnapshot,
    apply: (snapshot: MindMapSnapshot) => void
  ) => void;
  clear: () => void;
};

const HISTORY_LIMIT = 100;

const cloneNodes = (nodes: MindMapNode[]): MindMapNode[] =>
  nodes.map((node) => ({
    ...node,
    pos: { ...node.pos },
    style: { ...node.style, padding: { ...node.style.padding } },
    childrens: cloneNodes(node.childrens),
  }));

export const createMindMapSnapshot = (
  source: MindMapSnapshot
): MindMapSnapshot => ({
  nodes: cloneNodes(source.nodes),
  selectedNodeId: source.selectedNodeId,
  editingNodeId: source.editingNodeId,
  offset: { ...source.offset },
  scale: source.scale,
});

const cloneSnapshot = (snapshot: MindMapSnapshot): MindMapSnapshot =>
  createMindMapSnapshot(snapshot);

export const useMindMapHistory = create<MindMapHistoryState>((set, get) => ({
  past: [],
  future: [],
  pushSnapshot: (snapshot) => {
    set((state) => ({
      past: [...state.past, snapshot].slice(-HISTORY_LIMIT),
      future: [],
    }));
  },
  undo: (current, apply) => {
    const { past, future } = get();
    if (past.length === 0) {
      return;
    }
    const snapshot = past[past.length - 1];
    apply(cloneSnapshot(snapshot));
    set({
      past: past.slice(0, -1),
      future: [current, ...future],
    });
  },
  redo: (current, apply) => {
    const { past, future } = get();
    if (future.length === 0) {
      return;
    }
    const snapshot = future[0];
    apply(cloneSnapshot(snapshot));
    set({
      past: [...past, current].slice(-HISTORY_LIMIT),
      future: future.slice(1),
    });
  },
  clear: () => set({ past: [], future: [] }),
}));
