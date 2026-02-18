import type { MindMapNode } from "../state/mindMap";

/**
 * Escapes markdown special characters in a line so it can be used inside list items.
 */
function escapeMarkdownLine(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/^#+\s/g, (m) => "\\".repeat(m.length) + m)
    .replace(/^\s*[-*+]\s/g, "\\- ")
    .replace(/^\d+\.\s/g, (m) => m.replace(".", "\\."))
    .replace(/\[/g, "\\[")
    .replace(/\]/g, "\\]")
    .replace(/^>/g, "\\>")
    .replace(/^\s*\d+\./gm, (m) => m.replace(".", "\\."));
}

function nodeToMarkdownLine(node: MindMapNode): string {
  const trimmed = node.text.trim();
  if (node.type === "image") {
    if (!trimmed) return "[imagem]";
    try {
      new URL(trimmed);
      return `[imagem](${trimmed})`;
    } catch {
      return trimmed || "[imagem]";
    }
  }
  return escapeMarkdownLine(trimmed || "(vazio)");
}

const MAX_HEADING_LEVEL = 6;

function walkToMarkdown(nodes: MindMapNode[], depth: number): string[] {
  const lines: string[] = [];
  const visible = nodes.filter((n) => n.isVisible);
  const sorted = [...visible].sort((a, b) => a.sequence - b.sequence);
  const headingLevel = Math.min(depth + 1, MAX_HEADING_LEVEL);
  const prefix = "#".repeat(headingLevel);

  for (const node of sorted) {
    const content = nodeToMarkdownLine(node);
    lines.push(`${prefix} ${content}`);
    lines.push("");
    if (node.childrens.length > 0) {
      lines.push(...walkToMarkdown(node.childrens, depth + 1));
    }
  }
  return lines;
}

/**
 * Converts the mind map tree to formatted Markdown.
 * Hierarchy is expressed with heading levels: # (central), ## (first level), ### (second), etc.
 * So the outline is clear in any Markdown viewer.
 */
export function mindMapToMarkdown(nodes: MindMapNode[]): string {
  if (nodes.length === 0) return "";

  const roots = nodes.filter((n) => n.isVisible);
  if (roots.length === 0) return "";

  const lines: string[] = [];
  const sortedRoots = [...roots].sort((a, b) => a.sequence - b.sequence);

  for (const root of sortedRoots) {
    const title = root.text.trim() || "Mapa mental";
    const escapedTitle = title.replace(/^#+\s*/, "").replace(/\n/g, " ");
    lines.push(`# ${escapedTitle}`);
    lines.push("");
    if (root.childrens.length > 0) {
      lines.push(...walkToMarkdown(root.childrens, 1));
    }
  }

  return lines.join("\n").trimEnd();
}

export type ExportMarkdownOptions = {
  /** Filename for download (without extension). */
  filename?: string;
};

/**
 * Builds markdown from the given nodes and triggers download of a .md file.
 */
export function exportMindMapAsMarkdown(
  nodes: MindMapNode[],
  options: ExportMarkdownOptions = {},
): void {
  const md = mindMapToMarkdown(nodes);
  if (!md) return;

  const filename = options.filename ?? `mind-map-${Date.now()}`;
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.md`;
  a.click();
  URL.revokeObjectURL(url);
}
