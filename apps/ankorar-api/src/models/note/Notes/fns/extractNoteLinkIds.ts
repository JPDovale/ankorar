/**
 * Extrai IDs de notas do conteúdo, no formato wiki-link:
 * - [[id-da-nota]]
 * - [[id-da-nota|nome exibido no texto]]
 * Retorna IDs únicos, na ordem da primeira ocorrência.
 */
export function extractNoteLinkIds(text: string): string[] {
  if (!text || typeof text !== "string") return [];

  const regex = /\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
  const ids = new Set<string>();

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const id = match[1].trim();
    if (id) ids.add(id);
  }

  return Array.from(ids);
}
