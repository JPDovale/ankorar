import { MindMapNormalizationError } from "@/src/infra/errors/MindMapNormalizationError";
import { JsonValue } from "../Map";

/** Cores dos segmentos: só filhos diretos do central variam; nodex aplica estilo e layout ao abrir. */
const SEGMENT_COLOR_PALETTE = [
  "hsl(220, 70%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(280, 65%, 55%)",
  "hsl(30, 75%, 50%)",
  "hsl(190, 70%, 45%)",
  "hsl(340, 65%, 55%)",
  "hsl(50, 80%, 48%)",
  "hsl(260, 60%, 50%)",
  "hsl(140, 55%, 42%)",
  "hsl(310, 60%, 52%)",
];

function getColorForIndex(index: number): string {
  return SEGMENT_COLOR_PALETTE[index % SEGMENT_COLOR_PALETTE.length];
}

type RawNode = {
  id?: string;
  text?: string;
  type?: string;
  childrens?: RawNode[];
  [key: string]: unknown;
};

/** Formato amigável retornado pela IA: lista plana com parentId (sem recursão). */
type FlatNode = {
  id: string;
  text: string;
  type: string;
  parentId: string | null;
};

function isRawNode(value: unknown): value is RawNode {
  return value !== null && typeof value === "object" && "text" in value;
}

function isFlatNode(value: unknown): value is FlatNode {
  if (value === null || typeof value !== "object") return false;
  const o = value as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.text === "string" &&
    ("parentId" in o && (o.parentId === null || typeof o.parentId === "string"))
  );
}

/** Verifica se o payload é formato flat (nodes com parentId). */
function isFlatFormat(data: unknown): data is { nodes: FlatNode[] } {
  if (data === null || typeof data !== "object" || !("nodes" in data)) return false;
  const nodes = (data as { nodes: unknown }).nodes;
  if (!Array.isArray(nodes) || nodes.length === 0) return false;
  return isFlatNode(nodes[0]);
}

/**
 * Converte lista plana (flat) em árvore RawNode com childrens preenchidos.
 * Ordena filhos por ordem de aparição na lista original.
 */
function buildTreeFromFlat(nodes: FlatNode[]): RawNode {
  const byId = new Map<string, RawNode & { childrens: RawNode[] }>();
  for (const n of nodes) {
    const raw: RawNode & { childrens: RawNode[] } = {
      id: n.id,
      text: n.text,
      type: n.type,
      childrens: [],
    };
    byId.set(n.id, raw);
  }
  let root: (RawNode & { childrens: RawNode[] }) | null = null;
  for (const n of nodes) {
    const raw = byId.get(n.id)!;
    if (n.parentId === null) {
      if (root != null) {
        throw new MindMapNormalizationError(
          "Flat format must have exactly one root (parentId: null)",
          { raw: nodes.slice(0, 5) },
        );
      }
      root = raw;
    } else {
      const parent = byId.get(n.parentId);
      if (!parent) {
        throw new MindMapNormalizationError(
          `Flat node "${n.id}" references missing parentId "${n.parentId}"`,
          { raw: n },
        );
      }
      parent.childrens.push(raw);
    }
  }
  if (!root) {
    throw new MindMapNormalizationError(
      "Flat format must have one node with parentId: null",
      { raw: nodes.length },
    );
  }
  return root;
}

/**
 * Cores: só os filhos diretos do nó central recebem cor nova da paleta; os nós internos
 * herdam a cor do ramo (mesma cor do filho do central ao qual pertencem).
 */
function normalizeNode(
  raw: RawNode,
  idSeq: { next: number },
  colorIndex: { next: number },
  isRoot: boolean,
  parentColor: string | null,
): JsonValue {
  const id = String(raw.id ?? idSeq.next++);
  const text = typeof raw.text === "string" ? raw.text : " ";
  const type = isRoot
    ? "central"
    : raw.type === "central"
      ? "central"
      : "default";

  const isDirectChildOfCentral = parentColor === null && !isRoot;
  const color = isRoot
    ? SEGMENT_COLOR_PALETTE[0]
    : isDirectChildOfCentral
      ? getColorForIndex(colorIndex.next++)
      : parentColor!;

  const rawChildren = Array.isArray(raw.childrens) ? raw.childrens : [];
  const sequence = 0;
  const isVisible = true;
  const pos = { x: 0, y: 0 };

  const style = {
    color,
    backgroundColor: "transparent",
  };

  const childParentColor = isRoot ? null : color;

  const childrens = rawChildren
    .filter((c): c is RawNode => isRawNode(c))
    .map((c) => normalizeNode(c, idSeq, colorIndex, false, childParentColor));

  return {
    id,
    text,
    type,
    pos,
    style: { ...style },
    sequence,
    isVisible,
    childrens,
  };
}

function extractRootNodes(data: unknown): RawNode[] {
  if (data !== null && typeof data === "object" && "nodes" in data) {
    const nodes = (data as { nodes: unknown }).nodes;
    if (Array.isArray(nodes) && nodes.length > 0 && isRawNode(nodes[0])) {
      return [nodes[0]];
    }
  }
  if (Array.isArray(data) && data.length > 0 && isRawNode(data[0])) {
    return [data[0]];
  }
  if (isRawNode(data)) {
    return [data];
  }
  return [];
}

/**
 * Normalizes raw AI output into a single root node array suitable for Map content.
 * Aceita dois formatos:
 * - Flat: { nodes: [ { id, text, type, parentId }, ... ] } — preferido, mais fácil para a IA gerar em cadeia.
 * - Aninhado (legado): { nodes: [ { id, text, type, childrens: [...] } ] }.
 */
export function normalizeMindMapNodesFromAi(raw: unknown): JsonValue[] {
  const idSeq = { next: 1 };
  const colorIndex = { next: 0 };

  if (isFlatFormat(raw)) {
    const rootRaw = buildTreeFromFlat(raw.nodes);
    const normalized = normalizeNode(rootRaw, idSeq, colorIndex, true, null);
    return [normalized];
  }

  const roots = extractRootNodes(raw);
  if (roots.length === 0) {
    throw new MindMapNormalizationError(
      "Expected an object with 'nodes' array (flat with parentId or one nested root node)",
      {
        raw:
          typeof raw === "object" && raw !== null
            ? raw
            : String(raw).slice(0, 500),
      },
    );
  }
  const normalized = normalizeNode(roots[0], idSeq, colorIndex, true, null);
  return [normalized];
}
