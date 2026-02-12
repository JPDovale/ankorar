import { useMindMapState } from "../../state/mindMap";
import { CentalNode } from "./CentalNode";
import { DefaultNode } from "./DefaultNode";
import { ImageNode } from "./ImageNode";
import { Segments } from "./Segments";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";

export function Nodes() {
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
      className="absolute left-0 top-0 h-full w-full"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
        transformOrigin: "0 0",
      }}
    >
      <Segments nodes={nodes} />

      {flatNodes.map((node) => {
        if (node.type === "central") {
          return <CentalNode key={node.id} node={node} />;
        }
        if (node.type === "image") {
          return <ImageNode key={node.id} node={node} />;
        }
        return <DefaultNode key={node.id} node={node} />;
      })}
    </div>
  );
}
