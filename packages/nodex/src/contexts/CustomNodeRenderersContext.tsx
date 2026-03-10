import type { ComponentType } from "react";
import type { CSSProperties } from "react";
import {
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";
import type { MindMapNode } from "../state/mindMap";

/**
 * Props passed to custom node components. Same style slots as built-in nodes.
 */
export interface CustomNodeProps {
  node: MindMapNode;
  className?: string;
  style?: CSSProperties;
  contentClassName?: string;
  contentStyle?: CSSProperties;
}

/**
 * Map of customType string -> React component to render that node.
 * Register via Nodex customNodeRenderers prop.
 */
export type CustomNodeRenderers = Record<
  string,
  ComponentType<CustomNodeProps>
>;

type CustomNodeRenderersContextValue = {
  customNodeRenderers: CustomNodeRenderers;
};

const defaultValue: CustomNodeRenderersContextValue = {
  customNodeRenderers: {},
};

const CustomNodeRenderersContext =
  createContext<CustomNodeRenderersContextValue>(defaultValue);

export function CustomNodeRenderersProvider({
  customNodeRenderers = {},
  children,
}: {
  customNodeRenderers?: CustomNodeRenderers;
  children: ReactNode;
}) {
  const value = useMemo(
    () => ({ customNodeRenderers }),
    [customNodeRenderers],
  );

  return (
    <CustomNodeRenderersContext.Provider value={value}>
      {children}
    </CustomNodeRenderersContext.Provider>
  );
}

export function useCustomNodeRenderers(): CustomNodeRenderersContextValue {
  return useContext(CustomNodeRenderersContext);
}
