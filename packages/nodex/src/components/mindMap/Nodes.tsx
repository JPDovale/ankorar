import type { CSSProperties } from "react";
import { useMindMapState } from "../../state/mindMap";
import { CentalNode } from "./CentalNode";
import { DefaultNode } from "./DefaultNode";
import { ImageNode } from "./ImageNode";
import { Segments } from "./Segments";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
import { cn } from "../../lib/utils";

export interface NodesStyleSlots {
  nodesWrapperClassName?: string;
  nodesWrapperStyle?: CSSProperties;
  centralNodeClassName?: string;
  centralNodeStyle?: CSSProperties;
  centralNodeContentClassName?: string;
  centralNodeContentStyle?: CSSProperties;
  defaultNodeClassName?: string;
  defaultNodeStyle?: CSSProperties;
  defaultNodeContentClassName?: string;
  defaultNodeContentStyle?: CSSProperties;
  imageNodeClassName?: string;
  imageNodeStyle?: CSSProperties;
  imageNodeContentClassName?: string;
  imageNodeContentStyle?: CSSProperties;
}

interface NodesProps extends NodesStyleSlots {
  className?: string;
}

export function Nodes({
  className,
  nodesWrapperClassName,
  nodesWrapperStyle,
  centralNodeClassName,
  centralNodeStyle,
  centralNodeContentClassName,
  centralNodeContentStyle,
  defaultNodeClassName,
  defaultNodeStyle,
  defaultNodeContentClassName,
  defaultNodeContentStyle,
  imageNodeClassName,
  imageNodeStyle,
  imageNodeContentClassName,
  imageNodeContentStyle,
}: NodesProps = {}) {
  const { offset, scale, nodes, getFlatNodes } = useMindMapState(
    useShallow((state) => ({
      offset: state.offset,
      scale: state.scale,
      nodes: state.nodes,
      getFlatNodes: state.getFlatNodes,
    })),
  );

  const flatNodes = useMemo(getFlatNodes, [nodes]);

  return (
    <div
      className={cn(
        "absolute left-0 top-0 h-full w-full",
        className,
        nodesWrapperClassName,
      )}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        transformOrigin: "0 0",
        ...nodesWrapperStyle,
      }}
    >
      <Segments nodes={nodes} />

      {flatNodes.map((node) => {
        if (node.type === "central") {
          return (
            <CentalNode
              key={node.id}
              node={node}
              className={centralNodeClassName}
              style={centralNodeStyle}
              contentClassName={centralNodeContentClassName}
              contentStyle={centralNodeContentStyle}
            />
          );
        }
        if (node.type === "image") {
          return (
            <ImageNode
              key={node.id}
              node={node}
              className={imageNodeClassName}
              style={imageNodeStyle}
              contentClassName={imageNodeContentClassName}
              contentStyle={imageNodeContentStyle}
            />
          );
        }
        return (
          <DefaultNode
            key={node.id}
            node={node}
            className={defaultNodeClassName}
            style={defaultNodeStyle}
            contentClassName={defaultNodeContentClassName}
            contentStyle={defaultNodeContentStyle}
          />
        );
      })}
    </div>
  );
}
