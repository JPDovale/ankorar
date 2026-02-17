export function buildMindMapPrompt(description: string): string {
  return `Você é um especialista em mapas mentais. Gere um mapa mental MUITO DETALHADO e DENSO em JSON.

DESCRIÇÃO PEDIDA PELO USUÁRIO:
"${description}"

REQUISITOS DE CONTEÚDO (OBRIGATÓRIOS):
- O mapa deve ser EXTREMAMENTE DETALHADO: explore o tema em profundidade, com vários níveis de ramificação (idealmente 4 ou mais níveis de profundidade quando o tema permitir).
- ALTA DENSIDADE: o nó central deve ter pelo menos 4 a 8 ramos principais; cada ramo deve ter sub-ramos (2 a 5 filhos por nó quando fizer sentido); continue ramificando até níveis mais granulares.
- NÓ CENTRAL: apenas o TÍTULO com NO MÁXIMO TRÊS PALAVRAS, sem descrição. Exemplos: "Sharding Vertical", "Protocolo TCP", "Mapa Mental".
- DEMAIS NÓS — formato do texto:
  * TÍTULO (conceito ou nome curto), com uma quebra de linha inserida entre a 5ª e a 7ª palavra do título (ex.: "Protocolo TCP de transporte\\nseguro").
  * Duas quebras de linha (\\n\\n).
  * Em seguida: descrição em 1 ou 2 frases explicando o que é ou do que se trata o nó.
  Exemplo: "Protocolo TCP de rede\\n\\nO TCP é um protocolo de rede usado por computadores para comunicação segura e ordenada."
  Nós muito simples podem ter só o título; para a maioria, use título (com quebra entre 5ª e 7ª palavra) + \\n\\n + descrição.
- Nenhum nó deve ter fundo/background; apenas texto.
- Inclua detalhes práticos, subcategorias, exemplos, causas/efeitos, etapas, critérios — conforme o tema pedir. O resultado deve parecer um mapa de estudo ou planejamento rico, não um esboço superficial.

REGRAS TÉCNICAS:
1. Responda APENAS com um objeto JSON válido com uma única chave "nodes" cujo valor é um array contendo exatamente UM nó raiz.
2. Nó raiz: type "central". Todos os demais: type "default".
3. Cada nó: "id" (string única, "1", "2", "3", ...), "text" (string), "type" ("central" ou "default"), "childrens" (array de nós filhos, recursivo).
4. Não inclua "pos", "style", "sequence" nem "isVisible". Apenas: id, text, type, childrens.

EXEMPLO (central só título com no máximo 3 palavras; demais: título com quebra entre 5ª e 7ª palavra + \\n\\n + descrição):
{
  "nodes": [
    {
      "id": "1",
      "text": "Tema Central",
      "type": "central",
      "childrens": [
        {
          "id": "2",
          "text": "Primeiro ramo principal com conceito\\n\\nCategoria que agrupa os subtópicos e sua relevância no tema.",
          "type": "default",
          "childrens": [
            {
              "id": "3",
              "text": "Subtópico específico do ramo\\n\\nExplicação breve do que este nó representa.",
              "type": "default",
              "childrens": [{ "id": "4", "text": "Detalhe ou exemplo", "type": "default", "childrens": [] }]
            }
          ]
        },
        {
          "id": "5",
          "text": "Segundo ramo principal detalhado\\n\\nOutra dimensão do tema com descrição resumida.",
          "type": "default",
          "childrens": []
        }
      ]
    }
  ]
}

Gere o JSON completo agora: um mapa mental extremamente detalhado e denso para a descrição fornecida.`;
}
