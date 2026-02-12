import { create } from "zustand";

export type MindMapNodeTextAlign = "left" | "center" | "right";
export type MindMapNodeFontSize = 14 | 16 | 18 | 20 | 22 | 24;
export type MindMapNodeType = "default" | "central" | "image";

export type MindMapNodeStyle = {
  w: number;
  h: number;
  color: string;
  wrapperPadding: number;
  isBold: boolean;
  isItalic: boolean;
  fontSize: MindMapNodeFontSize;
  textColor: string;
  backgroundColor: string;
  textAlign: MindMapNodeTextAlign;
  padding: MindMapPos;
};
export type MindMapPos = { x: number; y: number };
export type MindMapNode = {
  id: string;
  text: string;
  type: MindMapNodeType;
  pos: MindMapPos;
  style: MindMapNodeStyle;
  sequence: number;
  isVisible: boolean;
  childrens: MindMapNode[];
};

interface UseMindMapState {
  scale: number;
  maxScale: number;
  minScale: number;

  offset: MindMapPos;

  clampScale: (nextScale: number) => number;
  setScale: (nextScale: number) => void;
  setOffset: (nextOffset: { x: number; y: number }) => void;

  nodes: MindMapNode[];
  selectedNodeId: string | null;
  editingNodeId: string | null;
  makeChildNode: (node: MindMapNode) => MindMapNode;
  zenMode: boolean;
  helpOpen: boolean;
  findNode: (nodeId: string) => MindMapNode | null;
  findNodeParent: (nodeId: string) => MindMapNode | null;
  updateNode: (node: MindMapNode) => void;
  setSelectedNode: (nodeId: string | null) => void;
  setEditingNode: (nodeId: string | null) => void;
  setZenMode: (nextValue: boolean) => void;
  setHelpOpen: (nextValue: boolean) => void;
  removeNode: (nodeId: string) => void;
  showAllNodes: () => void;
  hideNonCentralChildren: () => void;
  getFlatNodes: () => MindMapNode[];
  getCentralNode: () => MindMapNode | null;
  getSelectedNode: () => MindMapNode | null;
}

const createId = () => `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 70%, 45%)`;
const DEFAULT_FONT_FAMILY = '"Geist", sans-serif';
let textMeasureContext: CanvasRenderingContext2D | null = null;

const getTextMeasureContext = () => {
  if (textMeasureContext) {
    return textMeasureContext;
  }
  if (typeof document === "undefined") {
    return null;
  }
  const canvas = document.createElement("canvas");
  textMeasureContext = canvas.getContext("2d");
  return textMeasureContext;
};

const getNodeFontWeight = (node: MindMapNode) => {
  if (!node.style.isBold) {
    return 400;
  }
  return node.type === "central" ? 700 : 600;
};

const measureNodeText = (node: MindMapNode) => {
  const context = getTextMeasureContext();
  if (!context) {
    return {
      w: Math.max(8, node.style.w - node.style.padding.x),
      h: Math.max(8, node.style.h - node.style.padding.y),
    };
  }

  const fontStyle = node.style.isItalic ? "italic" : "normal";
  const fontWeight = getNodeFontWeight(node);
  context.font = `${fontStyle} ${fontWeight} ${node.style.fontSize}px ${DEFAULT_FONT_FAMILY}`;

  const lines = (node.text ?? "").split("\n");
  let maxWidth = 0;
  for (const line of lines) {
    const width = context.measureText(line).width;
    if (width > maxWidth) {
      maxWidth = width;
    }
  }

  const lineHeight = Math.ceil(node.style.fontSize * 1.5);

  return {
    w: Math.ceil(maxWidth),
    h: Math.ceil(lineHeight * Math.max(1, lines.length)),
  };
};
const cloneNodes = (nodes: MindMapNode[]): MindMapNode[] =>
  nodes.map((node) => ({
    ...node,
    pos: { ...node.pos },
    style: { ...node.style },
    sequence: node.sequence,
    isVisible: node.isVisible,
    childrens: cloneNodes(node.childrens),
  }));

const layoutNodes = (nodes: MindMapNode[]) => {
  const roots = cloneNodes(nodes);
  const visited = new Set<string>();
  const gapX = 180;
  const gapY = 72;
  const subtreeHeightMemo = new Map<string, number>();

  const sortBySequence = (items: MindMapNode[]) =>
    [...items].sort((a, b) => a.sequence - b.sequence);

  const getSubtreeHeight = (node: MindMapNode): number => {
    if (!node.isVisible) {
      return 0;
    }
    const cached = subtreeHeightMemo.get(node.id);
    if (cached !== undefined) {
      return cached;
    }
    if (node.childrens.length === 0) {
      subtreeHeightMemo.set(node.id, node.style.h);
      return node.style.h;
    }

    const visibleChildren = sortBySequence(
      node.childrens.filter((child) => child.isVisible)
    );

    if (node.type === "central") {
      const orderedChildren = visibleChildren;
      const childrenHeights = orderedChildren.map((child) =>
        getSubtreeHeight(child)
      );
      const { left, right } = splitChildrenByCount(
        orderedChildren,
        childrenHeights
      );
      const leftHeight =
        left.reduce((sum, item) => sum + item.height, 0) +
        gapY * Math.max(0, left.length - 1);
      const rightHeight =
        right.reduce((sum, item) => sum + item.height, 0) +
        gapY * Math.max(0, right.length - 1);
      const height = Math.max(node.style.h, Math.max(leftHeight, rightHeight));
      subtreeHeightMemo.set(node.id, height);
      return height;
    }

    const childrenHeights = visibleChildren.map((child) =>
      getSubtreeHeight(child)
    );
    const totalHeight =
      childrenHeights.reduce((sum, height) => sum + height, 0) +
      gapY * Math.max(0, visibleChildren.length - 1);
    const height = Math.max(node.style.h, totalHeight);
    subtreeHeightMemo.set(node.id, height);
    return height;
  };

  const splitChildrenByCount = (
    children: MindMapNode[],
    heights: number[]
  ): {
    left: Array<{ node: MindMapNode; height: number }>;
    right: Array<{ node: MindMapNode; height: number }>;
  } => {
    const splitIndex = Math.ceil(children.length / 2);
    const left = children
      .slice(0, splitIndex)
      .map((child, index) => ({ node: child, height: heights[index] }));
    const right = children.slice(splitIndex).map((child, index) => ({
      node: child,
      height: heights[index + splitIndex],
    }));
    return { left, right };
  };

  const layoutFrom = (
    parent: MindMapNode,
    sideHint: "left" | "right" = "right"
  ) => {
    if (visited.has(parent.id)) {
      return;
    }
    visited.add(parent.id);
    const children = sortBySequence(
      parent.childrens.filter((child) => child.isVisible)
    );
    if (children.length === 0) {
      return;
    }

    const childrenHeights = children.map((child) => getSubtreeHeight(child));
    const parentCenterY = parent.pos.y + parent.style.h / 2;

    if (parent.type === "central") {
      const { left, right } = splitChildrenByCount(children, childrenHeights);

      const layoutColumn = (
        column: Array<{ node: MindMapNode; height: number }>,
        side: "left" | "right"
      ) => {
        if (column.length === 0) {
          return;
        }
        const totalHeight =
          column.reduce((sum, item) => sum + item.height, 0) +
          gapY * (column.length - 1);
        let cursorY = parentCenterY - totalHeight / 2;

        for (const item of column) {
          const child = item.node;
          const x =
            side === "right"
              ? parent.pos.x + parent.style.w + gapX
              : parent.pos.x - gapX - child.style.w;
          child.pos = {
            x,
            y: cursorY + (item.height - child.style.h) / 2,
          };
          cursorY += item.height + gapY;
          layoutFrom(child, side);
        }
      };

      layoutColumn(left, "left");
      layoutColumn(right, "right");
      return;
    }

    const totalHeight =
      childrenHeights.reduce((sum, height) => sum + height, 0) +
      gapY * Math.max(0, children.length - 1);
    let cursorY = parentCenterY - totalHeight / 2;

    const side = sideHint;
    for (const [index, child] of children.entries()) {
      const blockHeight = childrenHeights[index];
      child.pos = {
        x:
          side === "right"
            ? parent.pos.x + parent.style.w + gapX
            : parent.pos.x - gapX - child.style.w,
        y: cursorY + (blockHeight - child.style.h) / 2,
      };
      cursorY += blockHeight + gapY;
      layoutFrom(child, side);
    }
  };

  for (const root of roots) {
    if (!root.isVisible) {
      continue;
    }
    layoutFrom(root, "right");
  }

  return roots;
};

const updateVisibilityTree = (
  items: MindMapNode[],
  updater: (node: MindMapNode, parent?: MindMapNode) => boolean,
  parent?: MindMapNode
): MindMapNode[] =>
  items.map((node) => {
    const isVisible = updater(node, parent);
    return {
      ...node,
      isVisible,
      childrens: updateVisibilityTree(node.childrens, updater, node),
    };
  });

const removeNodeTree = (
  items: MindMapNode[],
  nodeId: string
): MindMapNode[] => {
  let changed = false;
  const nextItems = items
    .filter((node) => {
      if (node.id === nodeId) {
        changed = true;
        return false;
      }
      return true;
    })
    .map((node) => {
      const nextChildren = removeNodeTree(node.childrens, nodeId);
      if (nextChildren === node.childrens) {
        return node;
      }
      changed = true;
      const normalizedChildren = nextChildren.map((child, index) => ({
        ...child,
        sequence: index,
      }));
      return { ...node, childrens: normalizedChildren };
    });

  return changed ? nextItems : items;
};

const useMindMapState = create<UseMindMapState>((set, get) => ({
  maxScale: 12,
  minScale: 0.1,
  scale: 1,
  selectedNodeId: null,
  editingNodeId: null,
  zenMode: false,
  helpOpen: false,

  nodes: [],
  offset: { x: 0, y: 0 },

  findNode: (nodeId) => {
    const { getFlatNodes } = get();
    const node = getFlatNodes().find((n) => n.id === nodeId);
    return node ?? null;
  },
  findNodeParent: (nodeId) => {
    const { getCentralNode } = get();

    const centralNode = getCentralNode();
    let parent: MindMapNode | null = null;

    if (!centralNode || centralNode?.id === nodeId) {
      return parent;
    }

    const walk = (node: MindMapNode) => {
      for (const child of node.childrens) {
        if (child.id === nodeId) {
          parent = node;
          break;
        }

        walk(child);
      }
    };

    walk(centralNode);

    return parent;
  },
  getSelectedNode: () => {
    const { selectedNodeId, getFlatNodes } = get();
    const node = getFlatNodes().find((node) => node.id === selectedNodeId);
    return node ?? null;
  },
  getFlatNodes: () => {
    const { nodes } = get();

    const list: MindMapNode[] = [];

    const walk = (nodeList: typeof nodes) => {
      for (const node of nodeList) {
        if (!node.isVisible) {
          continue;
        }

        list.push(node);

        if (node.childrens.length !== 0) {
          walk(node.childrens);
        }
      }
    };

    walk(nodes);

    return list;
  },
  getCentralNode: () => {
    const { getFlatNodes } = get();
    const flatNodes = getFlatNodes();
    const centralNode = flatNodes.find((node) => node.type === "central");
    return centralNode ?? null;
  },
  clampScale: (nextScale) => {
    const { minScale, maxScale } = get();
    return Math.min(maxScale, Math.max(minScale, nextScale));
  },
  setScale: (nextScale) => {
    const clamped = get().clampScale(nextScale);
    if (clamped === get().scale) {
      return;
    }
    set({ scale: clamped });
  },
  setOffset: (nextOffset) => {
    const current = get().offset;
    if (current.x === nextOffset.x && current.y === nextOffset.y) {
      return;
    }
    set({ offset: nextOffset });
  },
  setSelectedNode: (nodeId) => {
    set({ selectedNodeId: nodeId });
  },
  setEditingNode: (nodeId) => {
    set({ editingNodeId: nodeId });
  },
  setZenMode: (nextValue) => {
    set({ zenMode: nextValue });
  },
  setHelpOpen: (nextValue) => {
    set((state) =>
      state.helpOpen === nextValue ? state : { helpOpen: nextValue }
    );
  },
  removeNode: (nodeId) => {
    const { nodes, selectedNodeId, editingNodeId } = get();
    const centralNode = nodes.find((node) => node.type === "central");
    if (centralNode?.id === nodeId) {
      return;
    }
    const nextNodes = removeNodeTree(nodes, nodeId);
    if (nextNodes === nodes) {
      return;
    }

    set({
      nodes: layoutNodes(nextNodes),
      selectedNodeId: selectedNodeId === nodeId ? null : selectedNodeId,
      editingNodeId: editingNodeId === nodeId ? null : editingNodeId,
    });
  },
  showAllNodes: () => {
    const { nodes } = get();
    const nextNodes = updateVisibilityTree(nodes, () => true);
    set({ nodes: layoutNodes(nextNodes) });
  },
  hideNonCentralChildren: () => {
    const { nodes } = get();
    const nextNodes = updateVisibilityTree(nodes, (node, parent) => {
      if (node.type === "central") {
        return true;
      }
      return parent?.type === "central";
    });
    set({ nodes: layoutNodes(nextNodes) });
  },
  updateNode: (node) => {
    const { nodes, scale } = get();

    if (node.type !== "image") {
      const padding = node.style.padding;
      const textSize = measureNodeText(node);
      const measuredRect = {
        width: textSize.w * scale,
        height: textSize.h * scale,
      };
      const nextSize = {
        w: Math.max(8, Math.ceil(measuredRect.width / scale + padding.x)),
        h: Math.max(8, Math.ceil(measuredRect.height / scale + padding.y)),
      };
      node.style.w = nextSize.w;
      node.style.h = nextSize.h;
    }

    const updater = (
      nodes: MindMapNode[],
      node: MindMapNode
    ): MindMapNode[] => {
      return nodes.map((n) => {
        const nextNode = n.id === node.id ? node : n;
        const nextChildren = updater(nextNode.childrens, node);

        if (nextNode === n && nextChildren === n.childrens) {
          return n;
        }

        return { ...nextNode, childrens: nextChildren };
      });
    };

    const nextNodes = updater(nodes, node);

    set({ nodes: layoutNodes(nextNodes) });
  },
  makeChildNode: (node: MindMapNode) => {
    return {
      id: createId(),
      pos: { x: 0, y: 0 },
      text: "",
      type: "default",
      style: {
        w: 91,
        h: 36,
        padding: { x: 24, y: 16 },
        color: node.type === "central" ? randomColor() : node.style.color,
        wrapperPadding: 32,
        isBold: false,
        isItalic: false,
        fontSize: 14,
        textColor: "#0f172a",
        backgroundColor: "transparent",
        textAlign: "left",
      },
      sequence: node.childrens.length + 1,
      isVisible: true,
      childrens: [],
    };
  },
}));

export { useMindMapState };
