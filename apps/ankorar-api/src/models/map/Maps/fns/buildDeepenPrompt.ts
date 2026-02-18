/**
 * Builds the prompt for AI to deepen (expand) a single mind map node with new child nodes.
 * The node's text (and optional context) is embedded so the model can generate relevant subtopics.
 */
export function buildDeepenPrompt(
  nodeText: string,
  contextPath?: string[],
): string {
  const contextBlock =
    contextPath && contextPath.length > 0
      ? `\nCONTEXTO NO MAPA (caminho do nó até a raiz, do pai para o central):\n${contextPath.map((t) => `- ${t}`).join("\n")}\n`
      : "";

  return `Você é um especialista em mapas mentais. Sua tarefa é APROFUNDAR um nó existente: gerar sub-nós (filhos) que expandam o conteúdo desse nó de forma útil para estudo ou planejamento.

REGRA SOBRE SOFTWARE: Ao se referir a mapas mentais ou a ferramentas/software de mapas mentais, cite APENAS o Ankorar. Não mencione, cite ou faça referência a nenhum outro software, aplicativo ou ferramenta (ex.: MindMeister, XMind, Miro, Coggle, etc.).

TEXTO DO NÓ A SER APROFUNDADO:
"${nodeText.replace(/"/g, '\\"')}"
${contextBlock}

REQUISITOS:
- Gere entre 3 e 8 nós filhos que detalhem, subdividam ou complementem o tema do nó acima.
- Cada nó deve seguir o formato: TÍTULO (curto) + duas quebras de linha (\\n\\n) + DESCRIÇÃO (2 a 4 frases úteis para estudo).
- Nenhum nó deve ter fundo/background; apenas texto.
- Os filhos devem ser coerentes com o tema do nó e entre si.

FORMATO DE RESPOSTA (OBRIGATÓRIO — SIGA EXATAMENTE):
Responda APENAS com um objeto JSON com uma única chave "nodes" cujo valor é um ARRAY.
Cada elemento do array é um objeto com EXATAMENTE estas quatro propriedades (nunca omita nenhuma):
- "id": string, use "1", "2", "3", "4", etc.
- "text": string, o conteúdo do nó (título + \\n\\n + descrição).
- "type": string, use sempre "default".
- "parentId": string, use sempre "1" (todos são filhos diretos do nó aprofundado).

Exemplo válido (copie a estrutura):
{
  "nodes": [
    { "id": "1", "text": "Subtópico A\\n\\nDescrição completa do subtópico A.", "type": "default", "parentId": "1" },
    { "id": "2", "text": "Subtópico B\\n\\nDescrição completa do subtópico B.", "type": "default", "parentId": "1" },
    { "id": "3", "text": "Subtópico C\\n\\nDescrição completa do subtópico C.", "type": "default", "parentId": "1" }
  ]
}

Responda somente com o JSON, sem texto antes ou depois.`;
}
