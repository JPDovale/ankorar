import { Editor } from "@/components/editor";

const TUTORIAL_CONTENT = `Este e o seu espaco para criar documentos ricos com formatacao, tabelas, codigo e ate expressoes matematicas. Abaixo voce encontra um guia rapido de tudo que pode fazer.

---

## Formatacao de texto

Selecione qualquer trecho de texto para ver a **barra de formatacao flutuante**. Com ela voce pode aplicar:

- **Negrito** — tambem com \`Ctrl+B\`
- *Italico* — tambem com \`Ctrl+I\`
- ~~Tachado~~
- \`Codigo inline\`

## Menu de comandos

Digite \`/\` em uma linha vazia para abrir o menu de blocos. Voce pode buscar pelo nome do bloco enquanto digita. Os blocos disponiveis sao:

| Comando | O que faz | Atalho |
| --- | --- | --- |
| /texto | Paragrafo simples | — |
| /titulo1 | Titulo grande (H1) | — |
| /titulo2 | Titulo medio (H2) | — |
| /titulo3 | Titulo pequeno (H3) | — |
| /lista | Lista com marcadores | — |
| /numerada | Lista numerada | — |
| /tarefa | Lista de tarefas (checkbox) | — |
| /citacao | Bloco de citacao | — |
| /codigo | Bloco de codigo com syntax highlight | — |
| /tabela | Tabela 3x3 editavel | — |
| /math | Expressao matematica inline (LaTeX) | — |
| /bloco | Equacao centralizada (LaTeX) | — |
| /separador | Linha horizontal divisoria | — |

## Titulos e hierarquia

### Este e um titulo H3

Use titulos para organizar seu documento em secoes. Eles estao disponiveis nos niveis 1, 2 e 3.

## Listas

Lista com marcadores:

- Primeiro item
- Segundo item
- Terceiro item

Lista numerada:

1. Passo um
2. Passo dois
3. Passo tres

Lista de tarefas:

- [x] Ler o tutorial do editor
- [ ] Experimentar o menu de comandos /
- [ ] Criar minha primeira tabela
- [ ] Inserir uma formula matematica

## Citacoes

> As melhores ideias surgem quando voce para de ter medo de errar.

## Bloco de codigo

Blocos de codigo possuem syntax highlight automatico:

\`\`\`typescript
function saudacao(nome: string): string {
  return \`Ola, \${nome}! Bem-vindo ao editor.\`;
}

console.log(saudacao("mundo"));
\`\`\`

## Tabelas

Passe o mouse sobre uma tabela para ver os **controles de edicao** no lado esquerdo. Voce pode adicionar e remover linhas, colunas, alternar cabecalho e excluir a tabela inteira.

Clique em qualquer celula para editar diretamente o conteudo:

| Recurso | Descricao | Status |
| --- | --- | --- |
| Formatacao inline | Negrito, italico, sublinhado, tachado, destaque | Disponivel |
| Blocos via / | Menu de comandos com busca | Disponivel |
| Tabelas | Com controles de edicao interativos | Disponivel |
| Matematica LaTeX | Formulas inline e em bloco | Disponivel |

## Expressoes matematicas

Voce pode inserir matematica de duas formas:

- **Inline** — a formula aparece junto ao texto, como $E = mc^2$ ou $\\frac{a}{b}$
- **Bloco** — a formula fica centralizada e destacada

Clique em qualquer formula para edita-la. Aqui estao alguns exemplos:

Fracao simples: $\\frac{3}{12}$

Raiz quadrada: $\\sqrt{144}$

Somatorio: $\\sum_{i=1}^{n} x_i$

Equacao em bloco:

$$\\int_{0}^{\\infty} e^{-x^2} \\, dx = \\frac{\\sqrt{\\pi}}{2}$$

Matriz:

$$\\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix}$$

Sistema de equacoes:

$$\\begin{cases} x + y = 10 \\\\ 2x - y = 5 \\end{cases}$$

---

## Dicas rapidas

- Use \`/\` para inserir qualquer tipo de bloco rapidamente
- Selecione texto para formata-lo com a barra flutuante
- Passe o mouse sobre tabelas para acessar os controles de edicao
- Clique em formulas para edita-las no editor visual de LaTeX
- O editor salva o conteudo automaticamente conforme voce digita

Agora e com voce! Apague este tutorial e comece a criar.
`;

export function EditorPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="mb-4 border-none bg-transparent text-3xl font-bold tracking-tight text-text-primary outline-none">
        Bem-vindo ao Editor
      </h1>

      <Editor
        key="tutorial"
        content={TUTORIAL_CONTENT}
        onChange={() => {}}
        placeholder="Pressione '/' para inserir blocos..."
      />
    </div>
  );
}
