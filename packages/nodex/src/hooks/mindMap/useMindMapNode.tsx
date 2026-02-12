import {
  type MindMapNodeFontSize,
  type MindMapNodeTextAlign,
  type MindMapNodeType,
  useMindMapState,
} from "../../state/mindMap";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useHelpers } from "./useHelpers";

interface UseMindMapNodeProps {
  nodeId?: string | null;
}

export function useMindMapNode({ nodeId }: UseMindMapNodeProps) {
  const helpers = useHelpers();
  const {
    nodes,
    findNode,
    findNodeParent,
    updateNode,
    setSelectedNode,
    setEditingNode,
    removeNode,
    makeChildNode,
  } = useMindMapState(
    useShallow((state) => ({
      nodes: state.nodes,
      findNode: state.findNode,
      findNodeParent: state.findNodeParent,
      updateNode: state.updateNode,
      setSelectedNode: state.setSelectedNode,
      setEditingNode: state.setEditingNode,
      removeNode: state.removeNode,
      makeChildNode: state.makeChildNode,
    }))
  );

  const nId = nodeId ?? "";
  const { node, parent } = useMemo(
    () => ({
      node: findNode(nId),
      parent: findNodeParent(nId),
    }),
    [nodeId, nodes]
  );

  const updater = (cb: () => void) => {
    cb();
    return createLogicalNode();
  };

  const toggleBold = () =>
    updater(() => {
      node!.style.isBold = !node!.style.isBold;
    });

  const toggleItalic = () =>
    updater(() => {
      node!.style.isItalic = !node!.style.isItalic;
    });

  const updateFontSize = (fontSize: MindMapNodeFontSize) =>
    updater(() => {
      node!.style.fontSize = fontSize;
    });

  const updateType = (type: MindMapNodeType) =>
    updater(() => {
      if (type === "central") return createLogicalNode();
      node!.type = type;
    });

  const updateTextAling = (textAling: MindMapNodeTextAlign) =>
    updater(() => {
      node!.style.textAlign = textAling;
    });

  const clearText = () =>
    updater(() => {
      node!.text = "";
    });

  const updateBackgroundColor = (backgroundCollor: string) =>
    updater(() => {
      node!.style.backgroundColor = backgroundCollor;
    });

  const updateTextColor = (textColor: string) =>
    updater(() => {
      node!.style.textColor = textColor;
    });

  const updateText = (text?: string | null) =>
    updater(() => {
      if (text === undefined) return;
      node!.text = text ?? "";
    });

  const updateSize = (w?: number, h?: number) =>
    updater(() => {
      if (w) {
        node!.style.w = w;
      }

      if (h) {
        node!.style.h = h;
      }
    });

  const commit = () => {
    if (!node) return;
    updateNode(node);
  };

  const chain = () => {
    return createLogicalNode();
  };

  const select = () => {
    if (!node) return;
    setSelectedNode(node.id);
  };

  const edit = () => {
    if (!node) return;
    setEditingNode(node.id);
  };

  const getSide = () => {
    return helpers.getNodeSide(node);
  };

  const destroy = () => {
    if (!node) return;
    removeNode(node.id);
  };

  const togglechildrensVisibility = () => {
    if (!node) return;
    const childs = node.childrens.map((child) => ({
      ...child,
      isVisible: !child.isVisible,
    }));

    node.childrens = childs;
    updateNode(node);
  };

  const addChild = () => {
    if (!node) return;
    const newchildrens = node.childrens;

    const newChilderen = makeChildNode(node);

    newchildrens.push(newChilderen);

    node.childrens = newchildrens;
    updateNode(node);
    setSelectedNode(newChilderen.id);
    setEditingNode(newChilderen.id);
  };

  const createLogicalNode = () => {
    return {
      ...node!,
      toggleBold,
      toggleItalic,

      updateFontSize,
      updateType,
      updateTextAling,
      updateBackgroundColor,
      updateTextColor,
      updateText,
      updateSize,
      commit,

      clearText,
    };
  };

  const createNode = () => {
    if (!node) return null;
    return {
      ...node,
      parent,
      chain,
      select,
      edit,
      getSide,
      destroy,
      togglechildrensVisibility,
      addChild,
    };
  };

  return {
    node: createNode(),
  };
}
