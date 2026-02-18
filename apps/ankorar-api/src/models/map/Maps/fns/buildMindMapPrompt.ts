export function buildMindMapPrompt(description: string): string {
  return `Você é um especialista em mapas mentais. Gere um mapa mental MUITO DETALHADO e DENSO em JSON.

REGRA SOBRE SOFTWARE: Ao se referir a mapas mentais ou a ferramentas/software de mapas mentais, cite APENAS o Ankorar. Não mencione, cite ou faça referência a nenhum outro software, aplicativo ou ferramenta (ex.: MindMeister, XMind, Miro, Coggle, etc.).

DESCRIÇÃO PEDIDA PELO USUÁRIO:
"${description}"

REQUISITOS DE CONTEÚDO (OBRIGATÓRIOS):
- O mapa deve ser EXTREMAMENTE DETALHADO: explore o tema em profundidade, com vários níveis de ramificação (idealmente 4 ou mais níveis de profundidade quando o tema permitir).
- ALTA DENSIDADE: o nó central deve ter pelo menos 4 a 8 ramos principais; cada ramo deve ter sub-ramos (2 a 5 filhos por nó quando fizer sentido); continue ramificando até níveis mais granulares.
- NÓ CENTRAL: apenas o TÍTULO com NO MÁXIMO TRÊS PALAVRAS, sem descrição. Exemplos: "Sharding Vertical", "Protocolo TCP", "Mapa Mental".
- DEMAIS NÓS — formato do texto:
  * TÍTULO (conceito ou nome curto).
  * Duas quebras de linha (\\n\\n).
  * DESCRIÇÃO COMPLETA: 2 a 4 frases (ou mais quando necessário) explicando em profundidade o que é o conceito, como se aplica, relações com outros termos e, quando fizer sentido, exemplos ou detalhes práticos. As descrições devem ser ricas e autocontidas, capazes de servir como material de estudo.
  Exemplo: "Protocolo TCP\\n\\nO TCP (Transmission Control Protocol) é um protocolo de camada de transporte que garante entrega ordenada e confiável de dados entre aplicações. Ele estabelece conexão, controla fluxo e congestionamento, e retransmite pacotes perdidos. É a base de serviços como HTTP, HTTPS e SSH."
  Evite descrições de uma linha; priorize explicações completas e úteis.
- Nenhum nó deve ter fundo/background; apenas texto.
- Inclua detalhes práticos, subcategorias, exemplos, causas/efeitos, etapas, critérios — conforme o tema pedir. O resultado deve parecer um mapa de estudo ou planejamento rico, não um esboço superficial.

FORMATO DE RESPOSTA (OBRIGATÓRIO — LISTA PLANA, SEM ANINHAMENTO):
Responda APENAS com um objeto JSON com uma única chave "nodes" cujo valor é um ARRAY DE NÓS EM LISTA PLANA (sem recursão).
Cada nó é um objeto com exatamente: "id" (string única, "1", "2", "3", ...), "text" (string), "type" ("central" ou "default"), "parentId" (string do id do nó pai, ou null para o nó raiz).

REGRAS DO FORMATO:
1. O PRIMEIRO nó da lista deve ser o nó central: id "1", type "central", parentId null.
2. Os demais nós referenciam o pai pelo parentId: use o "id" do nó pai. Ex.: um nó com parentId "1" é filho do central; um nó com parentId "2" é filho do nó de id "2".
3. Não use aninhamento (sem "childrens"). A hierarquia é definida só por parentId. Assim você pode incluir dezenas de nós e vários níveis de profundidade sem se perder em chaves.
4. Ordene os nós de forma que um pai apareça antes de seus filhos na lista (raiz primeiro, depois filhos diretos, depois netos, etc.).

EXEMPLO (lista plana — central primeiro, depois filhos por parentId):
{
  "nodes": [
    { "id": "1", "text": "Tema Central", "type": "central", "parentId": null },
    { "id": "2", "text": "Primeiro ramo principal\\n\\nCategoria que agrupa os subtópicos e define sua relevância no tema. Aqui você descreve o papel desse ramo no todo e como se conecta aos demais. Inclua o contexto necessário para quem estuda.", "type": "default", "parentId": "1" },
    { "id": "3", "text": "Subtópico específico\\n\\nExplicação completa do que este nó representa: definição, aplicação e relação com o ramo pai. Quanto mais útil para estudo, melhor.", "type": "default", "parentId": "2" },
    { "id": "4", "text": "Detalhe ou exemplo\\n\\nDescreva aqui o detalhe com duas a quatro frases, dando exemplos ou critérios quando fizer sentido.", "type": "default", "parentId": "3" },
    { "id": "5", "text": "Segundo ramo principal\\n\\nOutra dimensão do tema, também com descrição completa. Explique o que é, como se usa e como se relaciona com o nó central e com outros ramos.", "type": "default", "parentId": "1" }
  ]
}

Gere o JSON completo agora: um mapa mental extremamente detalhado e denso para a descrição fornecida, usando SEMPRE a lista plana com id, text, type e parentId.`;
}
