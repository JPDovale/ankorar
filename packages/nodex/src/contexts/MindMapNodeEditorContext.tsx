import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";
import type { MindMapNode } from "../state/mindMap";

export type NodeEditorCustomButton = {
  key: string;
  children: ReactNode;
  onAction: (node: MindMapNode) => void;
};

type MindMapNodeEditorContextValue = {
  customButtons: NodeEditorCustomButton[];
};

const defaultValue: MindMapNodeEditorContextValue = {
  customButtons: [],
};

const MindMapNodeEditorContext =
  createContext<MindMapNodeEditorContextValue>(defaultValue);

export function MindMapNodeEditorProvider({
  customButtons = [],
  children,
}: {
  customButtons?: NodeEditorCustomButton[];
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ customButtons }),
    [customButtons],
  );

  return (
    <MindMapNodeEditorContext.Provider value={value}>
      {children}
    </MindMapNodeEditorContext.Provider>
  );
}

export function useMindMapNodeEditorContext(): MindMapNodeEditorContextValue {
  return useContext(MindMapNodeEditorContext);
}
