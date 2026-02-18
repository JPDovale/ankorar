import { MindMapNormalizationError } from "@/src/infra/errors/MindMapNormalizationError";
import { JsonValue } from "../Map";

/** Minimal shape: AI may omit type and parentId; we accept id + text. */
type DeepenNodeInput = {
  id?: string;
  text: string;
  type?: string;
  parentId?: string | null;
};

function isDeepenNodeInput(value: unknown): value is DeepenNodeInput {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return typeof o.text === "string" && o.text.length > 0;
}

function isDeepenFormat(data: unknown): data is { nodes: unknown[] } {
  if (data === null || typeof data !== "object" || !("nodes" in data))
    return false;
  const nodes = (data as { nodes: unknown }).nodes;
  if (!Array.isArray(nodes) || nodes.length === 0) return false;
  return typeof nodes[0] === "object" && nodes[0] !== null && "text" in nodes[0];
}

/** Parent node shape: we only need style.color for children. */
type ParentStyle = { color?: string };
const DEFAULT_PARENT_COLOR = "hsl(220, 70%, 50%)";

/**
 * Normalizes AI deepen response into an array of child nodes ready to be
 * appended to the deepened node. All nodes in the response are treated as
 * direct children (parentId "1" or any). Generates new UUIDs for ids.
 */
export function normalizeDeepenNodesFromAi(
  raw: unknown,
  parentStyle: ParentStyle,
): JsonValue[] {
  if (!isDeepenFormat(raw)) {
    throw new MindMapNormalizationError(
      "Deepen response must be an object with 'nodes' array (each node must have at least 'text')",
      {
        raw:
          typeof raw === "object" && raw !== null
            ? raw
            : String(raw).slice(0, 500),
      },
    );
  }

  const parentColor =
    parentStyle.color && parentStyle.color.trim()
      ? parentStyle.color
      : DEFAULT_PARENT_COLOR;

  const result: JsonValue[] = [];
  let sequence = 0;
  for (const item of raw.nodes) {
    if (!isDeepenNodeInput(item)) continue;
    const id = crypto.randomUUID();
    const text = item.text.trim() || " ";
    result.push({
      id,
      text,
      type: "default",
      pos: { x: 0, y: 0 },
      style: {
        color: parentColor,
        backgroundColor: "transparent",
      },
      sequence: sequence++,
      isVisible: true,
      childrens: [],
    });
  }

  return result;
}
