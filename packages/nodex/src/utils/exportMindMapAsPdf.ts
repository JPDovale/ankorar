import { jsPDF } from "jspdf";
import type { MindMapNode } from "../state/mindMap";

export type ExportPdfOptions = {
  /** Filename for download (without extension). */
  filename?: string;
  /** Page orientation. */
  orientation?: "portrait" | "landscape";
};

function nodeToPlainText(node: MindMapNode): string {
  const trimmed = node.text.trim();
  if (node.type === "image") {
    if (!trimmed) return "[imagem]";
    try {
      new URL(trimmed);
      return `[imagem] ${trimmed}`;
    } catch {
      return trimmed || "[imagem]";
    }
  }
  return trimmed || "(vazio)";
}

/** One content block = one node's text (can have multiple paragraphs). */
type ContentBlock = { level: number; paragraphs: string[] };

function walkToBlocks(nodes: MindMapNode[], level: number): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const visible = nodes.filter((n) => n.isVisible);
  const sorted = [...visible].sort((a, b) => a.sequence - b.sequence);

  for (const node of sorted) {
    const content = nodeToPlainText(node);
    const paragraphs = content
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (paragraphs.length === 0) paragraphs.push(" ");
    blocks.push({ level, paragraphs });
    if (node.childrens.length > 0) {
      blocks.push(...walkToBlocks(node.childrens, level + 1));
    }
  }
  return blocks;
}

function getDocumentStructure(nodes: MindMapNode[]): { title: string; blocks: ContentBlock[] } {
  const roots = nodes.filter((n) => n.isVisible);
  if (roots.length === 0) return { title: "", blocks: [] };

  const sortedRoots = [...roots].sort((a, b) => a.sequence - b.sequence);
  const root = sortedRoots[0];
  const title = root.text.trim() || "Mapa mental";
  const blocks = root.childrens.length > 0 ? walkToBlocks(root.childrens, 1) : [];
  return { title, blocks };
}

// —— Diagramação: grelha e ritmo tipográfico ——
const MARGIN_X = 56;
const MARGIN_TOP = 56;
const MARGIN_BOTTOM = 64;
const FOOTER_Y_OFFSET = 40;
const CONTENT_START = 80; // após área do título

// Título (nó central)
const TITLE_FONT_SIZE = 24;
const TITLE_LINE_HEIGHT = 1.08;
const TITLE_BOTTOM_RULE_WIDTH = 120;
const TITLE_RULE_THICKNESS = 2;
const SPACE_AFTER_TITLE = 48;

// Blocos de conteúdo
const BLOCK_VERTICAL_RHYTHM = 28;   // espaço entre blocos de mesmo nível
const BLOCK_VERTICAL_RHYTHM_MAJOR = 36; // antes de bloco nível 1 (separação de “capítulo”)
const PARAGRAPH_GAP = 10;           // entre parágrafos dentro do bloco
const ACCENT_BAR_WIDTH = 5;
const BAR_TO_TEXT = 14;
const INDENT_PER_LEVEL = 28;

const BLOCK_HEADING_SIZE = 12;     // primeiro parágrafo do bloco
const BLOCK_BODY_SIZE = 10;
const BLOCK_HEADING_LEADING = 1.15;
const BLOCK_BODY_LEADING = 1.2;
const FONT_SIZES = [BLOCK_HEADING_SIZE, 11, 10, 9, 9] as const;

// Paleta
const COLOR_TITLE = { r: 15, g: 23, b: 42 };
const COLOR_LEVEL_1_HEAD = { r: 30, g: 41, b: 59 };
const COLOR_LEVEL_1_BODY = { r: 51, g: 65, b: 85 };
const COLOR_LEVEL_2_PLUS = { r: 71, g: 85, b: 105 };
const COLOR_ACCENT = { r: 59, g: 130, b: 246 };
const COLOR_RULE = { r: 59, g: 130, b: 246 };
const COLOR_FOOTER = { r: 148, g: 163, b: 184 };

function setTextColor(doc: jsPDF, c: { r: number; g: number; b: number }): void {
  doc.setTextColor(c.r, c.g, c.b);
}

function setDrawColor(doc: jsPDF, c: { r: number; g: number; b: number }): void {
  doc.setDrawColor(c.r, c.g, c.b);
}

function setFillColor(doc: jsPDF, c: { r: number; g: number; b: number }): void {
  doc.setFillColor(c.r, c.g, c.b);
}

function drawFooter(doc: jsPDF, pageNum: number, pageW: number, pageH: number): void {
  setTextColor(doc, COLOR_FOOTER);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const str = String(pageNum);
  doc.text(str, pageW - MARGIN_X - doc.getTextWidth(str), pageH - FOOTER_Y_OFFSET);
}

function ensurePage(
  doc: jsPDF,
  y: number,
  maxY: number,
  pageNum: { current: number },
  pageW: number,
  pageH: number,
): number {
  if (y <= maxY) return y;
  drawFooter(doc, pageNum.current, pageW, pageH);
  doc.addPage();
  pageNum.current += 1;
  return MARGIN_TOP;
}

/**
 * Exports the mind map as a PDF. Central node = document title; every other node = a text block with heading + body. Expert typesetting: rhythm, measure, hierarchy.
 */
export function exportMindMapAsPdf(
  nodes: MindMapNode[],
  options: ExportPdfOptions = {},
): void {
  const { title, blocks } = getDocumentStructure(nodes);
  if (!title && blocks.length === 0) return;

  const filename = options.filename ?? `mind-map-${Date.now()}`;
  const orientation = options.orientation ?? "portrait";

  const doc = new jsPDF({
    orientation,
    unit: "pt",
    format: "a4",
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const contentWidth = pageW - MARGIN_X * 2;
  const maxY = pageH - MARGIN_BOTTOM - FOOTER_Y_OFFSET;
  const pageNum = { current: 1 };
  let y = MARGIN_TOP;

  // —— Título (nó central) ——
  if (title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(TITLE_FONT_SIZE);
    setTextColor(doc, COLOR_TITLE);
    const titleLines = doc.splitTextToSize(title, contentWidth);
    const titleLead = TITLE_FONT_SIZE * TITLE_LINE_HEIGHT;
    for (const line of titleLines) {
      doc.text(line, MARGIN_X, y + TITLE_FONT_SIZE * 0.9);
      y += titleLead;
    }
    y += 12;
    setDrawColor(doc, COLOR_RULE);
    doc.setLineWidth(TITLE_RULE_THICKNESS);
    doc.line(MARGIN_X, y, MARGIN_X + TITLE_BOTTOM_RULE_WIDTH, y);
    y += SPACE_AFTER_TITLE;
  } else {
    y = CONTENT_START;
  }

  // —— Blocos de texto (cada nó = um bloco com parágrafos) ——
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const prevLevel = i > 0 ? blocks[i - 1].level : 0;
    const { level, paragraphs } = block;
    const isLevel1 = level === 1;

    // Ritmo vertical: mais espaço antes de novo “capítulo” (nível 1)
    if (isLevel1 && prevLevel >= 1) y += BLOCK_VERTICAL_RHYTHM_MAJOR;
    else if (i > 0) y += BLOCK_VERTICAL_RHYTHM;

    const indent = MARGIN_X + (level - 1) * INDENT_PER_LEVEL;
    const textAreaWidth = contentWidth - (level - 1) * INDENT_PER_LEVEL - ACCENT_BAR_WIDTH - BAR_TO_TEXT;
    const textX = indent + ACCENT_BAR_WIDTH + BAR_TO_TEXT;

    const headingSize = FONT_SIZES[Math.min(level - 1, FONT_SIZES.length - 1)];
    const bodySize = BLOCK_BODY_SIZE;
    const headingLead = headingSize * BLOCK_HEADING_LEADING;
    const bodyLead = bodySize * BLOCK_BODY_LEADING;

    // Pré-calcular altura do bloco para desenhar a barra antes do texto
    let blockHeight = 0;
    for (let p = 0; p < paragraphs.length; p++) {
      const isFirst = p === 0;
      doc.setFontSize(isFirst ? headingSize : bodySize);
      const lead = isFirst ? headingLead : bodyLead;
      const lines = doc.splitTextToSize(paragraphs[p], textAreaWidth);
      blockHeight += lines.length * lead;
      if (p < paragraphs.length - 1) blockHeight += PARAGRAPH_GAP;
    }
    const barHeight = Math.min(blockHeight + 4, maxY - y + 6);
    if (barHeight > 0) {
      setFillColor(doc, COLOR_ACCENT);
      doc.rect(indent, y - 2, ACCENT_BAR_WIDTH, barHeight, "F");
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(headingSize);
    setTextColor(doc, level === 1 ? COLOR_LEVEL_1_HEAD : COLOR_LEVEL_2_PLUS);

    let blockY = y;

    for (let p = 0; p < paragraphs.length; p++) {
      const isFirst = p === 0;
      const fontSize = isFirst ? headingSize : bodySize;
      const leading = isFirst ? headingLead : bodyLead;
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isFirst ? "bold" : "normal");
      setTextColor(doc, isFirst && level === 1 ? COLOR_LEVEL_1_HEAD : isFirst ? COLOR_LEVEL_2_PLUS : COLOR_LEVEL_1_BODY);

      const lines = doc.splitTextToSize(paragraphs[p], textAreaWidth);
      for (const line of lines) {
        blockY = ensurePage(doc, blockY, maxY, pageNum, pageW, pageH);
        doc.text(line, textX, blockY + fontSize * 0.85);
        blockY += leading;
      }
      if (p < paragraphs.length - 1) blockY += PARAGRAPH_GAP;
    }

    y = blockY;
  }

  drawFooter(doc, pageNum.current, pageW, pageH);
  doc.save(`${filename}.pdf`);
}
