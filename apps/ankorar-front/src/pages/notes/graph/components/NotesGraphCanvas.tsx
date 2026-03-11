import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import * as d3Force from "d3-force";
import * as d3Drag from "d3-drag";
import * as d3Zoom from "d3-zoom";
import * as d3Selection from "d3-selection";
import { useTheme } from "@/hooks/useTheme";
import type { GraphNode, GraphEdge } from "@/services/notes/getNotesGraphRequest";
import { NotesGraphTooltip } from "./NotesGraphTooltip";

interface SimNode extends d3Force.SimulationNodeDatum {
  id: string;
  title: string;
}

interface SimLink extends d3Force.SimulationLinkDatum<SimNode> {
  source: SimNode | string;
  target: SimNode | string;
}

interface TooltipState {
  title: string;
  x: number;
  y: number;
}

interface Props {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const COLORS = {
  dark: {
    bg: "var(--ds-surface)",
    node: "#1a3350",
    nodeHover: "#254d78",
    nodeBorder: "#2e6090",
    nodeBorderHover: "#d4891e",
    edge: "#3a6a9a",
    label: "#e0ecf8",
  },
  light: {
    bg: "var(--ds-surface)",
    node: "#c0d8ee",
    nodeHover: "#9ec4e0",
    nodeBorder: "#6a9fc0",
    nodeBorderHover: "#c07010",
    edge: "#5a8fb0",
    label: "#0d2235",
  },
};

export function NotesGraphCanvas({ nodes, edges }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { themeMode } = useTheme();
  const isDark = themeMode === "dark";
  const c = isDark ? COLORS.dark : COLORS.light;

  const [simNodes, setSimNodes] = useState<SimNode[]>([]);
  const [simLinks, setSimLinks] = useState<SimLink[]>([]);
  const [transform, setTransform] = useState(d3Zoom.zoomIdentity);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const simulationRef = useRef<d3Force.Simulation<SimNode, SimLink> | null>(null);

  // Setup zoom
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3Selection.select(svgRef.current);

    const zoom = d3Zoom
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event: d3Zoom.D3ZoomEvent<SVGSVGElement, unknown>) => {
        setTransform(event.transform);
      });

    svg.call(zoom);

    return () => {
      svg.on(".zoom", null);
    };
  }, []);

  // Run simulation
  useEffect(() => {
    if (nodes.length === 0) {
      setSimNodes([]);
      setSimLinks([]);
      return;
    }

    // Get actual SVG dimensions to center the graph
    const svgEl = svgRef.current;
    const w = svgEl ? svgEl.clientWidth || svgEl.getBoundingClientRect().width : 800;
    const h = svgEl ? svgEl.clientHeight || svgEl.getBoundingClientRect().height : 600;
    const cx = w / 2;
    const cy = h / 2;

    // Clone nodes and pre-position them at center so they're visible immediately
    const simNodesCopy: SimNode[] = nodes.map((n, i) => {
      const angle = (i / nodes.length) * 2 * Math.PI;
      const radius = Math.min(w, h) * 0.25;
      return {
        ...n,
        x: cx + (nodes.length > 1 ? radius * Math.cos(angle) : 0),
        y: cy + (nodes.length > 1 ? radius * Math.sin(angle) : 0),
      };
    });

    const simLinksCopy: SimLink[] = edges.map((e) => ({
      source: e.from_note_id,
      target: e.to_note_id,
    }));

    // Show nodes immediately before simulation starts
    setSimNodes([...simNodesCopy]);
    setSimLinks([...simLinksCopy]);

    const simulation = d3Force
      .forceSimulation<SimNode>(simNodesCopy)
      .force(
        "link",
        d3Force
          .forceLink<SimNode, SimLink>(simLinksCopy)
          .id((d) => d.id)
          .distance(120),
      )
      .force("charge", d3Force.forceManyBody<SimNode>().strength(-300))
      .force("center", d3Force.forceCenter(cx, cy))
      .alphaDecay(0.02)
      .on("tick", () => {
        setSimNodes([...simNodesCopy]);
        setSimLinks([...simLinksCopy]);
      });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [nodes, edges]);

  // Attach drag behavior to node circles on each tick
  const buildDrag = useCallback(() => {
    return d3Drag
      .drag<SVGCircleElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0.3).restart();
        }
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active && simulationRef.current) {
          simulationRef.current.alphaTarget(0);
        }
        d.fx = null;
        d.fy = null;
      });
  }, []);

  useEffect(() => {
    if (!svgRef.current || simNodes.length === 0) return;
    const svg = d3Selection.select(svgRef.current);
    const drag = buildDrag();
    simNodes.forEach((node) => {
      const circle = svg.select<SVGCircleElement>(`circle[data-id="${node.id}"]`);
      if (!circle.empty()) {
        circle.datum(node).call(drag as never);
      }
    });
  }, [simNodes, buildDrag]);

  const getLink = (link: SimLink) => {
    const s = link.source as SimNode;
    const t = link.target as SimNode;
    if (typeof s === "string" || typeof t === "string") return null;
    return { x1: s.x ?? 0, y1: s.y ?? 0, x2: t.x ?? 0, y2: t.y ?? 0 };
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{ background: c.bg }}
    >
      {tooltip && (
        <NotesGraphTooltip title={tooltip.title} x={tooltip.x} y={tooltip.y} />
      )}
      <svg ref={svgRef} width="100%" height="100%" style={{ display: "block" }}>
        <g transform={transform.toString()}>
          {simLinks.map((link, i) => {
            const coords = getLink(link);
            if (!coords) return null;
            return (
              <line
                key={i}
                x1={coords.x1}
                y1={coords.y1}
                x2={coords.x2}
                y2={coords.y2}
                stroke={c.edge}
                strokeOpacity={0.5}
                strokeWidth={1.5}
              />
            );
          })}
          {simNodes.map((node) => {
            const isHovered = hoveredId === node.id;
            const x = node.x ?? 0;
            const y = node.y ?? 0;
            return (
              <g key={node.id}>
                <circle
                  data-id={node.id}
                  cx={x}
                  cy={y}
                  r={10}
                  fill={isHovered ? c.nodeHover : c.node}
                  stroke={isHovered ? c.nodeBorderHover : c.nodeBorder}
                  strokeWidth={isHovered ? 2 : 1}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    setHoveredId(node.id);
                    const rect = containerRef.current?.getBoundingClientRect();
                    setTooltip({
                      title: node.title,
                      x: e.clientX - (rect?.left ?? 0),
                      y: e.clientY - (rect?.top ?? 0),
                    });
                  }}
                  onMouseLeave={() => {
                    setHoveredId(null);
                    setTooltip(null);
                  }}
                  onMouseMove={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    setTooltip({
                      title: node.title,
                      x: e.clientX - (rect?.left ?? 0),
                      y: e.clientY - (rect?.top ?? 0),
                    });
                  }}
                  onClick={() => navigate(`/editor/${node.id}`)}
                />
                <text
                  x={x}
                  y={y + 20}
                  textAnchor="middle"
                  fill={c.label}
                  fontSize={10}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {node.title.length > 18 ? node.title.slice(0, 16) + "…" : node.title}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
