import z from "zod";

type MapNodeType = "default" | "central" | "image";
export type SanitizedMapNode = {
  id: string;
  pos: { x: number; y: number };
  text: string;
  type: MapNodeType;
  style: {
    h: number;
    w: number;
    color: string;
    isBold: boolean;
    padding: { x: number; y: number };
    fontSize: number;
    isItalic: boolean;
    textAlign: "left" | "center" | "right";
    textColor: string;
    wrapperPadding: number;
    backgroundColor: string;
  };
  sequence: number;
  childrens: SanitizedMapNode[];
  isVisible: boolean;
};

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  return fallback;
}

function toBoolean(value: unknown, fallback = true) {
  if (typeof value === "boolean") {
    return value;
  }

  return fallback;
}

function toString(value: unknown, fallback = "") {
  if (typeof value === "string") {
    return value;
  }

  return fallback;
}

function sanitizeNodeType(type: unknown): MapNodeType {
  if (type === "central" || type === "default" || type === "image") {
    return type;
  }

  return "default";
}

function sanitizeNode(node: unknown): SanitizedMapNode | null {
  if (typeof node !== "object" || node === null) {
    return null;
  }

  const source = node as Record<string, unknown>;
  const sourcePos =
    typeof source.pos === "object" && source.pos !== null
      ? (source.pos as Record<string, unknown>)
      : {};
  const sourceStyle =
    typeof source.style === "object" && source.style !== null
      ? (source.style as Record<string, unknown>)
      : {};
  const sourcePadding =
    typeof sourceStyle.padding === "object" && sourceStyle.padding !== null
      ? (sourceStyle.padding as Record<string, unknown>)
      : {};
  const childrensRaw = Array.isArray(source.childrens) ? source.childrens : [];

  const childrens = childrensRaw.reduce<SanitizedMapNode[]>((acc, child) => {
    const sanitizedChild = sanitizeNode(child);

    if (!sanitizedChild) {
      return acc;
    }

    acc.push(sanitizedChild);
    return acc;
  }, []);

  const textAlign = sourceStyle.textAlign;
  const sanitizedTextAlign =
    textAlign === "left" || textAlign === "center" || textAlign === "right"
      ? textAlign
      : "left";

  return {
    id: toString(source.id, ""),
    pos: {
      x: toNumber(sourcePos.x, 0),
      y: toNumber(sourcePos.y, 0),
    },
    text: toString(source.text, ""),
    type: sanitizeNodeType(source.type),
    style: {
      h: toNumber(sourceStyle.h, 36),
      w: toNumber(sourceStyle.w, 91),
      color: toString(sourceStyle.color, "#0f172a"),
      isBold: toBoolean(sourceStyle.isBold, false),
      padding: {
        x: toNumber(sourcePadding.x, 24),
        y: toNumber(sourcePadding.y, 16),
      },
      fontSize: toNumber(sourceStyle.fontSize, 14),
      isItalic: toBoolean(sourceStyle.isItalic, false),
      textAlign: sanitizedTextAlign,
      textColor: toString(sourceStyle.textColor, "#0f172a"),
      wrapperPadding: toNumber(sourceStyle.wrapperPadding, 32),
      backgroundColor: toString(sourceStyle.backgroundColor, "transparent"),
    },
    sequence: toNumber(source.sequence, 0),
    childrens,
    isVisible: toBoolean(source.isVisible, true),
  };
}

function sanitizeMapContent(content: unknown[]): SanitizedMapNode[] {
  return content.reduce<SanitizedMapNode[]>((acc, node) => {
    const sanitizedNode = sanitizeNode(node);

    if (!sanitizedNode) {
      return acc;
    }

    acc.push(sanitizedNode);
    return acc;
  }, []);
}

export const updateMapContentResponses = {
  200: z.object({
    status: z.number().min(200).max(200),
    data: z.null(),
  }),
  400: z.object({
    status: z.number().min(400).max(400),
    error: z.any(),
  }),
  404: z.object({
    status: z.number().min(404).max(404),
    error: z.any(),
  }),
};

export const updateMapContentParams = z.object({
  map_id: z.uuidv7(),
});

export const updateMapContentBody = z.object({
  content: z
    .array(z.unknown())
    .transform((content) => sanitizeMapContent(content)),
});
