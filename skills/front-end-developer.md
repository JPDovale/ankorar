---
name: front-end-developer
description: Skill normativa para criação, recriação e refatoração de interfaces React/Next.js com qualidade visual auditável, separação entre UI/lógica/dados, estados de tela consistentes e pontuação por regras. Use quando for necessário implementar ou revisar front-end com critérios rígidos de arquitetura e UI.
---

# Skill: Frontend UI Quality Gate (Codex) — `frontend-developer-v1`

## 1. Objetivo

Estabelecer uma skill normativa e auditável para **criação, recriação e refatoração de front-end** (React/Next.js), garantindo consistência visual, acessibilidade, separação arquitetural e disciplina de estados, com **pontuação por regras** e **auditoria pós-entrega**.

---

## 2. Escopo

Esta skill se aplica a:

- Componentes React (`.tsx/.jsx`), hooks (`use*`), páginas/rotas (Next.js App Router), layouts, shells, estilos (CSS Modules/Tailwind/Styled) e utilitários de UI.
- Adoção de **Suspense + skeleton** como padrão de carregamento, evitando lógica paralela de loading.
- Organização de tipos e separação estrita entre UI, lógica de domínio e camada de dados.

Fora de escopo:

- Back-end, infra, pipelines CI/CD, APIs e banco (exceto quando necessário para **remover side-effects do UI** e criar fronteiras corretas).
- Redesign visual completo não solicitado; a skill otimiza consistência e legibilidade sem reimaginar produto.

---

## 3. Definições e Convenções Normativas

### 3.1 Termos Normativos (RFC 2119)

- **DEVE / OBRIGATÓRIO**: requisito mandatário.
- **NÃO DEVE / PROIBIDO**: requisito que não pode ocorrer.
- **RECOMENDADO**: deve ser seguido, salvo justificativa técnica explícita no PR/commit.
- **OPCIONAL**: pode ser aplicado quando fizer sentido.

### 3.2 Definições Operacionais

- **UI Component**: arquivo de componente visual (render, layout, interação, acessibilidade).
- **Domain Logic**: regras de negócio, transformação de dados, validação, estados derivados.
- **Data Layer**: chamadas a API/side-effects (fetch, mutations, subscriptions, storage).
- **Estado de tela**: loading, empty, error, success (e variantes).
- **Layout shift**: mudança de layout perceptível durante carregamento (CLS).

### 3.3 Convenções de Estrutura (padrão sugerido)

- `src/ui/**` (componentes, layouts, primitives)
- `src/features/**` (composição por workflow)
- `src/domain/**` (regras e modelos de domínio)
- `src/data/**` (clients, repositories, queries/mutations)
- `src/pages/**` ou `app/**` (páginas/rotas e boundaries)

> Observação: a estrutura acima é RECOMENDADA. As regras normativas abaixo são OBRIGATÓRIAS independentemente da árvore.

### 3.4 Equivalência Terminológica (OBRIGATÓRIA)

- **Auditoria** e **Relatório** são o mesmo artefato lógico.
- No contexto desta skill:
  - **Auditar** = avaliar regras e pontuar arquivos.
  - **Gerar relatório** = materializar a auditoria em `relatorio.md`.
- A estrutura da auditoria **DEVE** ser idêntica no planejamento (`PLAN.md`) e no `relatorio.md`.

---

## 4. Regras

### Regra 1 — Suspense + Skeleton Loading (penalidade: -1)

**Definição formal**  
A UI **DEVE** apresentar estados de carregamento consistentes usando **Suspense + fallback skeleton** (ou boundary equivalente), **sem layout shift**.  
A UI **NÃO DEVE** manter lógica paralela/duplicada de loading (ex.: `isLoading` + `Suspense` para o mesmo trecho).

**Escopo de aplicação**  
Componentes de página, boundaries de feature, listas e áreas com fetch assíncrono.

**Critérios verificáveis**

- Existe fallback visual (skeleton/placeholder) com dimensões equivalentes ao conteúdo final.
- Não há duas fontes de truth para loading do mesmo bloco.
- O fallback não “pula” layout (altura/largura previsíveis).

**Validação (lógica)**

- Se `Suspense` existir para um trecho, não pode haver `if (isLoading)` controlando o mesmo trecho.
- Skeleton deve definir altura/linhas aproximadas do conteúdo.

**Exemplos**

- ✅ `return <Suspense fallback={<ListSkeleton/>}><List/></Suspense>`
- ❌ `if (isLoading) return <Spinner/>; return <Suspense ...>...`

**Impacto na pontuação**

- Violação: reduzir 1 ponto no arquivo afetado.

---

### Regra 2 — Component Return Structure (penalidade: -1)

**Definição formal**  
Componentes **DEVEM** preferir **um único `return`** e evitar múltiplos retornos que fragmentem a renderização.

**Escopo**  
Componentes UI e páginas.

**Critérios verificáveis**

- Um `return` principal com guards extraídos para variáveis/JSX helpers.
- Early returns apenas se forem guard clauses extremamente simples e RECOMENDADOS evitar.

**Validação**

- Contar `return` dentro do componente: idealmente 1; múltiplos retornos sem justificativa => violação.

**Exemplos**

- ✅ `const body = ...; return <Shell>{body}</Shell>`
- ❌ `if (a) return ...; if (b) return ...; return ...`

**Impacto**

- Violação: -1.

---

### Regra 3 — Conditional Complexity (penalidade: -3)

**Definição formal**  
A UI **NÃO DEVE** usar ternários aninhados ou cadeias complexas de `if/else`. **DEVE** usar guards simples, lógica extraída e funções puras.

**Critérios verificáveis**

- Sem ternário dentro de ternário.
- Sem `if/else if/else if...` longo em JSX.
- Condições complexas extraídas para variáveis nomeadas (`const canEdit = ...`).

**Validação**

- Detectar `?` dentro de expressão ternária; detectar `if/else` com mais de 2 níveis; detectar JSX com blocos condicionais extensos.

**Exemplos**

- ✅ `const status = getStatus(viewModel);`
- ❌ `{a ? (b ? <X/> : <Y/>) : <Z/>}`

**Impacto**

- Violação: -3.

---

### Regra 4 — Cursor & Interaction Semantics (penalidade: -1)

**Definição formal**  
Elementos interativos **DEVEM** comunicar interatividade via cursor/hover/focus/active coerentes. Elementos não interativos **NÃO DEVEM** parecer clicáveis.

**Critérios verificáveis**

- Botões/links: `cursor: pointer` (quando aplicável) + estados hover/focus/active.
- Não usar `div` clicável sem semântica (ver Regra 11).
- Estados visuais distintos para `disabled`.

**Validação**

- Interação sem estilos de feedback => violação.
- `onClick` em elemento não-semântico sem roles => violação.

**Impacto**

- Violação: -1.

---

### Regra 5 — Spacing & Layout Rhythm (penalidade: -2)

**Definição formal**  
Espaçamentos **DEVEM** seguir uma escala consistente e manter ritmo previsível entre irmãos (siblings).

**Critérios verificáveis**

- Uso de tokens/escala (ex.: 4/8/12/16/24/32) consistente no arquivo/feature.
- Evitar “quebras” de ritmo entre itens semelhantes.

**Validação**

- Mix arbitrário de paddings/margins sem padrão => violação.

**Impacto**

- Violação: -2.

---

### Regra 6 — Information Density (penalidade: -6)

**Definição formal**  
A UI **DEVE** balancear densidade: evitar poluição visual e evitar “vazio excessivo” que prejudique escaneabilidade.

**Critérios verificáveis**

- Hierarquia clara (título, contexto, ação primária).
- Componentes não devem empilhar excessivos badges/ícones/linhas sem agrupamento.
- Espaços não devem “dissociar” conteúdo relacionado.

**Validação**

- Conteúdo sem agrupamento, sem hierarquia, ou com grandes vazios sem propósito => violação.

**Impacto**

- Violação: -6.

---

### Regra 7 — Visual Consistency (penalidade: -5)

**Definição formal**  
Cores, espaçamento, tipografia e componentes **DEVEM** seguir um sistema unificado (design system/tokens).

**Critérios verificáveis**

- Uso consistente de componentes base.
- Evitar valores “mágicos” e variações ad-hoc.

**Validação**

- Mistura de padrões (ex.: vários tipos de botão/heading no mesmo contexto) => violação.

**Impacto**

- Violação: -5.

---

### Regra 8 — Elevation & Surface Discipline (penalidade: -4)

**Definição formal**  
A UI **NÃO DEVE** aninhar sombras/cards desnecessariamente, nem duplicar containers de superfície.

**Critérios verificáveis**

- Um nível de elevação por área funcional.
- Evitar “card dentro de card” sem motivo funcional.

**Validação**

- Sombra dentro de sombra / múltiplos wrappers repetidos => violação.

**Impacto**

- Violação: -4.

---

### Regra 9 — Grid & Alignment Consistency (penalidade: -2)

**Definição formal**  
A UI **DEVE** usar grid/alinhamento consistente. **NÃO DEVE** misturar alinhamentos que quebrem layouts.

**Critérios verificáveis**

- Colunas e gaps coerentes.
- Mesma baseline para labels/inputs/ações.

**Validação**

- Alinhamento inconsistente em irmãos semelhantes => violação.

**Impacto**

- Violação: -2.

---

### Regra 10 — Interaction Clarity (penalidade: -2)

**Definição formal**  
Áreas clicáveis e ações **DEVEM** ser óbvias, imediatas e com affordance clara.

**Critérios verificáveis**

- CTA primária destacada.
- Click target adequado.
- Evitar ações “escondidas” sem ícone/label.

**Validação**

- Ações dependentes de “descoberta” sem indicação => violação.

**Impacto**

- Violação: -2.

---

### Regra 11 — Accessibility Baseline (penalidade: -2)

**Definição formal**  
A UI **DEVE** usar semântica correta, `aria-*` quando necessário e contraste legível.

**Critérios verificáveis**

- Botões/links semânticos (`<button>`, `<a>`).
- Labels e `aria-label` em ícones.
- Estados `disabled`, `aria-busy`, `aria-live` quando aplicável.
- Navegação por teclado e foco visível.

**Validação**

- `div` com `onClick` sem role/tabIndex/keyboard handlers => violação.
- Elementos sem label acessível => violação.

**Impacto**

- Violação: -2.

---

### Regra 12 — State Visibility (penalidade: -2)

**Definição formal**  
Todos os estados (loading, empty, error, success) **DEVEM** estar explicitamente representados.

**Critérios verificáveis**

- Empty state com mensagem funcional.
- Error state com retry (quando aplicável).
- Success state com feedback.

**Validação**

- Fluxo sem tratamento de empty/error => violação.

**Impacto**

- Violação: -2.

---

### Regra 13 — UI Architecture Separation (penalidade: -3)

**Definição formal**  
Separação estrita entre UI, domínio e dados. UI **NÃO DEVE** conter regras de domínio complexas nem acesso direto à infraestrutura.

**Critérios verificáveis**

- UI recebe `viewModel`/props simples.
- Transformações complexas movidas para `domain`/`features`.

**Validação**

- Regras complexas dentro do componente => violação.

**Impacto**

- Violação: -3.

---

### Regra 14 — Organização de Página, Componentes e Hooks Locais (penalidade: -4)

**Definição formal**  
A arquitetura de página/componente **DEVE** manter separação clara entre renderização, estado, dados e composição.  
Componentes com múltiplos estados e hooks de carregamento de dados **DEVEM** ter a lógica extraída para hook local.  
Um arquivo de componente/página **NUNCA** deve ter mais de uma função de componente na raiz.

**Critérios verificáveis**

- Componente com múltiplos estados + hooks de dados (`useQuery`, `useSuspenseQuery`, hooks que utilizam react query, etc.) possui hook lógico em pasta `hooks` no mesmo nível do arquivo.
- Componente com muitas linhas ou muitas responsabilidades aplica pattern de composition.
- Página com partes úteis apenas ao contexto local separa em `components` dentro da pasta da própria página.
- Páginas seguem padrão Next.js de routing com `page.tsx` e colocalização por contexto.
- Exemplo de estrutura esperada: `pages/home/components/`, `pages/home/hooks/`, `pages/home/page.tsx`.
- Existe apenas uma função de componente na raiz por arquivo de componente/página.

**Validação**

- Detectar múltiplos estados + hooks de dados sem extração para hook local => violação.
- Detectar componente extenso/multirresponsável sem composition => violação.
- Detectar página com componentes/hooks locais fora da pasta da página => violação.
- Detectar rota fora do padrão Next.js (`page.tsx`) => violação.
- Detectar múltiplas funções de componente na raiz do arquivo => violação.

**Resolução obrigatória**

- Toda vez que um componente tiver múltiplos estados e uso de hooks de carregamento de dados, separar em hook lógico em pasta `hooks` no mesmo nível do arquivo.
- Toda vez que um componente tiver muitas linhas ou muitas responsabilidades, aplicar pattern de composition.
- Caso seja uma página, separar em componentes salvos na pasta `components` da pasta da página quando forem necessários somente naquele contexto.
- Todas as páginas devem seguir padrão de routing do Next.js.
- Exemplo: `pages/home/components/`, `pages/home/hooks/`, `pages/home/page.tsx`.

**Impacto**

- Violação: -4.

---

### Regra 15 — Code Readability & Structure (penalidade: -2)

**Definição formal**  
Código deve ser escaneável: evitar nesting profundo, lógica extensa antes do return e blocos longos inline.

**Critérios verificáveis**

- Helpers extraídos.
- JSX limpo com nomes semânticos.

**Validação**

- “paredões” de lógica dentro do componente => violação.

**Impacto**

- Violação: -2.

---

### Regra 16 — Suspense Migration Integrity (penalidade: -1)

**Definição formal**  
Migração para Suspense **NÃO DEVE** criar abstrações paralelas de loading.

**Critérios verificáveis**

- Uma única estratégia: Suspense + fallback.
- Sem wrappers duplicados que replicam loading states.

**Validação**

- Encontrar `LoadingWrapper` + `Suspense` juntos pro mesmo conteúdo => violação.

**Impacto**

- Violação: -1.

---

### Regra 17 — Type Organization & Naming (penalidade: -1)

**Definição formal**  
Tipos **DEVEM** ficar no topo do arquivo (ou em `types.ts`) com nomes claros e concisos.

**Critérios verificáveis**

- `type/enum/interface` antes de implementação.
- Nomes descritivos, sem abreviações obscuras.

**Validação**

- Tipos dispersos no meio do arquivo => violação.

**Impacto**

- Violação: -1.

---

### Regra 18 — Form Standardization (penalidade: -1)

**Definição formal**  
Forms **DEVEM** usar estratégia consistente (ex.: `react-hook-form`) e padrão único de validação.

**Critérios verificáveis**

- Um padrão por projeto/feature.
- Componentes de input integrados ao mesmo padrão.

**Validação**

- Mistura de padrões no mesmo fluxo => violação.

**Impacto**

- Violação: -1.

---

### Regra 19 — Dead Code Elimination (penalidade: -4)

**Definição formal**  
Código morto **DEVE** ser removido: imports não usados, variáveis não usadas, branches inalcançáveis.

**Critérios verificáveis**

- Zero `eslint-disable` para “unused” sem justificativa.
- Sem comentários de código antigo “to remove later”.

**Validação**

- Detectar símbolos não referenciados => violação.

**Impacto**

- Violação: -4.

---

### Regra 20 — Styling Strategy Consistency (penalidade: -4)

**Definição formal**  
Para styling baseado em estado, **DEVE** usar `data-*` (ex.: `data-state="open"`), inclusive em cenários de estilização complexa.  
**NÃO DEVE** usar funções, constantes ou qualquer geração condicional de classes dentro do componente para controlar estilo.  
Exceção: apenas em caso de extrema necessidade técnica, com justificativa explícita.

**Critérios verificáveis**

- Estados via `data-*` + seletores CSS/Tailwind variants compatíveis.
- Ausência de constantes de estilo/classe no componente (ex.: `const buttonClass = "..."`).
- Ausência de funções para gerar classe de estado (ex.: `getButtonClass()`).
- Ausência de geração condicional de classes (`clsx`, `cn`, template string condicional) para estado.
- Em exceções de extrema necessidade, deve existir justificativa explícita.

**Validação**

- Encontrar constantes/funções dedicadas a classe/estilo => violação.
- Encontrar geração condicional de classe para estado sem justificativa de extrema necessidade => violação.

**Impacto**

- Violação: -4.

---

### Regra 21 — Page Structure Integrity (penalidade: -1)

**Definição formal**  
Evitar re-exports e impor boundaries claras de página.

**Critérios verificáveis**

- Páginas exportam apenas o necessário.
- Sem “barrel” re-export em boundary de page.

**Validação**

- `export * from` em página/route boundary => violação.

**Impacto**

- Violação: -1.

---

### Regra 22 — Context Clarity (IA) (penalidade: -2)

**Definição formal**  
Toda tela **DEVE** expor: título, contexto e ação primária.

**Critérios verificáveis**

- Heading principal (H1 ou equivalente).
- Texto de contexto (subtítulo/descrição curta).
- CTA principal visível.

**Validação**

- Tela sem H1 ou sem ação primária => violação.

**Impacto**

- Violação: -2.

---

### Regra 23 — Workflow-Based Composition (penalidade: -2)

**Definição formal**  
UI **DEVE** ser composta por workflow do usuário, não por decoração visual.

**Critérios verificáveis**

- Componentes agrupados por tarefa (ex.: “Selecionar”, “Confirmar”, “Revisar”).
- Evitar wrappers apenas estéticos.

**Validação**

- “Seções” sem significado de fluxo => violação.

**Impacto**

- Violação: -2.

---

### Regra 24 — Action Placement (penalidade: -1)

**Definição formal**  
Ações **DEVEM** ficar próximas do conteúdo que afetam.

**Critérios verificáveis**

- Botões de item na linha do item ou seção correspondente.
- Evitar toolbar distante para ações locais.

**Validação**

- Ações desconectadas do alvo => violação.

**Impacto**

- Violação: -1.

---

### Regra 25 — Shell & Layout Structure (penalidade: -2)

**Definição formal**  
Aplicação **DEVE** usar app shell consistente (sidebar + main + scroll interno).

**Critérios verificáveis**

- Layout com regiões definidas.
- Scroll contido na área principal, não no body (quando aplicável).

**Validação**

- Páginas com shells diferentes sem justificativa => violação.

**Impacto**

- Violação: -2.

---

### Regra 26 — Scroll Behavior (penalidade: -2)

**Definição formal**  
Scroll **DEVE** ser previsível e contido; evitar múltiplos scrolls concorrentes.

**Critérios verificáveis**

- Uma área principal rolável.
- Modais/drawers com scroll interno controlado.

**Validação**

- Duplo scroll sem motivo => violação.

**Impacto**

- Violação: -2.

---

### Regra 27 — Component Usage Discipline (penalidade: -2)

**Definição formal**  
Evitar uso inadequado de cards/popovers/dialogs/nav patterns.

**Critérios verificáveis**

- Dialogs apenas para decisões críticas/fluxos curtos.
- Popovers para conteúdo curto contextual.
- Cards para agrupamento funcional, não decoração.

**Validação**

- Cards em excesso e aninhados => violação (ver Regra 8 também).

**Impacto**

- Violação: -2.

---

### Regra 28 — Interaction Feedback (penalidade: -1)

**Definição formal**  
Hover/focus/active **DEVEM** ser claros e responsivos em todos os elementos interativos.

**Critérios verificáveis**

- Focus visível (não removido).
- Active state perceptível.
- Disabled com contraste adequado.

**Validação**

- Elemento interativo sem feedback => violação.

**Impacto**

- Violação: -1.

---

### Regra 29 — Typography & Copy Quality (penalidade: -2)

**Definição formal**  
Manter hierarquia tipográfica clara e copy funcional (não marketing).

**Critérios verificáveis**

- Títulos, subtítulos, labels consistentes.
- Texto objetivo, orientado à ação.
- Evitar frases vagas (“incrível”, “revolucionário”).

**Validação**

- Copy promocional ou hierarquia inconsistente => violação.

**Impacto**

- Violação: -2.

---

### Regra 30 — Extração de Item em Renderização com `map` (penalidade: -4)

**Definição formal**  
Toda vez que uma lista usar `map` para renderizar um componente, o valor interno retornado pelo `map` **DEVE** ser extraído para um componente dedicado.

**Critérios verificáveis**

- `array.map(...)` não retorna bloco JSX complexo inline no mesmo arquivo.
- O conteúdo renderizado por item é delegado para componente dedicado (ex.: `<ItemComponent ... />`).
- O componente extraído tem responsabilidade clara por item da lista.

**Validação**

- Detectar `map` com JSX inline de item sem componente dedicado => violação.

**Impacto**

- Violação: -4.

---

## 5. Planejamento

### 5.1 Regra Geral de Planejamento

- Para operações **normais** (fora de funções `criar` e `recriar`), o agente **DEVE**:
  1. Auditar internamente o escopo alvo (arquivo/pasta) para levantar violações por regra, **sem gerar `relatorio.md` automaticamente**, usando a estrutura canônica da Seção 7.4.
  2. Gerar e **salvar fisicamente** `PLAN.md` na raiz da **aplicação que será alterada** com:
     - Blocos de auditoria por arquivo seguindo **exatamente** a estrutura da Seção 7.4 (arquivo + tabela Markdown completa de regras).
     - Checklist por arquivo e por regra seguindo **exatamente** a estrutura da Seção 7.5.
     - Pontuação-alvo por arquivo (OBRIGATÓRIO: ≥ 9, salvo justificativa).
  3. Resolver o caminho contextual do plano:
     - Se o alvo estiver em `apps/<nome>/...`, salvar em `apps/<nome>/PLAN.md`.
     - Se o alvo já for a raiz da aplicação, salvar em `<raiz-da-aplicacao>/PLAN.md`.
  4. Confirmar que `PLAN.md` existe no disco antes de prosseguir; se não existir, falhar o fluxo e não avançar.
  5. **Interromper em modo bloqueante** e solicitar autorização explícita do usuário antes de modificar código.
  6. **NÃO** aplicar patch, editar arquivo, ou executar comando que altere código sem autorização textual inequívoca.

### 5.2 Exceção Operacional (OBRIGATÓRIA)

- Quando as funções **invocáveis** `criar` ou `recriar` forem chamadas explicitamente:
  - O agente **DEVE** **IGNORAR** completamente o planejamento (não gerar `PLAN.md`, não pedir autorização).
  - O agente **DEVE** aplicar alterações diretamente.
  - O agente **NÃO DEVE** gerar `relatorio.md` automaticamente ao final; só quando solicitado.

### 5.3 Critério de Autorização (OBRIGATÓRIO)

- A autorização do usuário **DEVE** ser inequívoca (ex.: “autorizo aplicar”, “pode aplicar”, “execute o plano”).
- Respostas ambíguas (ex.: “ok”, “pode seguir” sem referência ao plano) **NÃO DEVEM** ser tratadas como autorização automática.
- Se o usuário pedir ajustes no plano, o agente **DEVE** atualizar `PLAN.md` e repetir o gate de autorização.

---

## 6. Execução

### 6.1 Execução Determinística — Fluxo Normal (com planejamento)

1. Auditar internamente o escopo solicitado (arquivo/pasta), sem criar `relatorio.md`, usando a estrutura da Seção 7.4.
2. Compilar lista de arquivos alvo e regras violadas, com penalidades.
3. Gerar `PLAN.md` no contexto da aplicação alvo com:
   - (a) tabela Markdown de auditoria para cada arquivo alvo, no formato da Seção 7.4,
   - (b) checklist por arquivo/regra no formato da Seção 7.5,
   - (c) pontuação-alvo por arquivo (≥ 9).
4. Validar que `PLAN.md` foi criado no filesystem e informar o caminho ao usuário.
5. Parar, mostrar o resumo do plano e solicitar autorização explícita.
6. Aguardar resposta do usuário sem alterar código.
7. Após autorização explícita:
   1. Refatorar primeiro separação arquitetural (Regras 13 e 14).
   2. Refatorar estrutura e tamanho (Regras 15, 17 e 19).
   3. Refatorar estados e Suspense (Regras 1, 12, 16, 2, 3).
   4. Refatorar UI/UX visual e interação (Regras 4–11, 20–30).
8. Reavaliar internamente os arquivos alterados.
9. Gerar `relatorio.md` **apenas se** o usuário solicitar explicitamente.
10. Ao concluir a aplicação das alterações, **apagar** o `PLAN.md` da aplicação alvo.
11. Se não for possível apagar `PLAN.md`, informar explicitamente o erro e não concluir o fluxo como finalizado.

### 6.2 Execução Determinística — Fluxo `criar`/`recriar` (sem planejamento)

1. Identificar o escopo solicitado (tela/feature/componente).
2. Definir boundary de UI vs domínio vs dados:
   - UI: apenas render, interação, acessibilidade.
   - Domínio: transformação/derivações.
   - Dados: fetch/mutations/side-effects.
3. Implementar estados explícitos:
   - Suspense fallback skeleton sem layout shift.
   - Empty/error/success representados.
4. Garantir estrutura de retorno:
   - Um `return` principal.
   - Guard clauses extraídas para variáveis/JSX helpers.
5. Aplicar disciplina de estilos:
   - `data-*` para estados.
   - Proibir constantes de className para estado.
6. Aplicar consistência visual:
   - spacing scale, grid/alinhamento, tipografia/copy.
   - disciplina de elevação (sem nested cards/shadows).
7. Garantir acessibilidade:
   - semântica, aria, foco visível, targets clicáveis.
8. Remover dead code.
9. Rodar auditoria pós-entrega apenas internamente.
10. Gerar `relatorio.md` **somente** mediante solicitação explícita do usuário.

---

## 7. Auditoria Pós-Entrega

### 7.1 Regras de Pontuação

- Pontuação inicial por arquivo: **10**.
- Para cada regra violada no arquivo, subtrair a **penalidade** correspondente.
- Pontuação final mínima RECOMENDADA: **≥ 9** por arquivo (salvo justificativa técnica explícita no relatório).
- O arquivo `relatorio.md` só é materializado quando o usuário solicitar explicitamente.

### 7.2 Formato OBRIGATÓRIO do Relatório

Para cada arquivo auditado, a auditoria/relatório **DEVE** incluir:

- Pontuação inicial: 10
- Lista **completa** de regras (1–30), cada uma com:
  - regra (id + nome)
  - penalidade
  - redução aplicada (inclusive 0)
  - evidência objetiva (trecho/descrição curta)
- Pontuação final
- Ações recomendadas (se pontuação < alvo)

### 7.3 Algoritmo de Auditoria (determinístico)

1. Para cada arquivo:
   - score = 10
2. Para regra i:
   - se violação detectada: score -= penalidade(i)
   - senão: redução aplicada = 0
3. Emitir tabela: `Regra | Penalidade | Redução | Score após`
4. Emitir score final e comparação com alvo.

### 7.4 Estrutura Canônica (Planejamento e Relatório)

Para cada arquivo, usar **sempre** o bloco abaixo em `PLAN.md` (auditoria inicial) e em `relatorio.md` (auditoria final):

```md
### Arquivo: <caminho-do-arquivo>
Tipo: Auditoria Inicial | Auditoria Final
Pontuação inicial: 10

| Regra | Penalidade | Redução aplicada | Evidência | Score após |
| --- | --- | --- | --- | --- |
| R1 - Suspense + Skeleton Loading | -1 | 0 | ... | 10 |
| ... | ... | ... | ... | ... |
| R29 - Typography & Copy Quality | -2 | 0 | ... | 10 |
| R30 - Extração de Item em Renderização com `map` | -4 | 0 | ... | 10 |

Pontuação final: <score>/10
Ações recomendadas:
- <ação 1>
- <ação 2>
```

- A lista de regras **NÃO DEVE** ser parcial.
- Em `PLAN.md`, rotular cada bloco como **Auditoria Inicial**.
- Em `relatorio.md`, rotular cada bloco como **Auditoria Final**.
- Em auditoria, **cada arquivo a ser alterado DEVE ter sua própria tabela Markdown**.

### 7.5 Estrutura OBRIGATÓRIA do Checklist no `PLAN.md`

Para cada arquivo com uma ou mais regras com redução aplicada (> 0), usar um único bloco por arquivo:

```md
### Arquivo: <caminho-do-arquivo>

#### Regra <id> - <nome-da-regra>
- [ ] <alteração objetiva 1>
- [ ] <alteração objetiva 2>

#### Regra <id> - <nome-da-regra>
- [ ] <alteração objetiva 1>
- [ ] <alteração objetiva 2>
```

- O checklist **DEVE** conter: nome do arquivo + um ou mais headers de regra + itens de alteração de cada regra.
- Quando houver múltiplas regras para o mesmo arquivo, o nome do arquivo **NÃO DEVE** ser repetido.
- Não agrupar regras de arquivos diferentes no mesmo bloco.

---

## 8. Funções Invocáveis

### 8.1 `relatorio` (SOB DEMANDA EXPLÍCITA)

**Assinatura (conceitual)**  
`relatorio(entrada: caminhoArquivoOuPasta, saida?: caminhoMarkdown) -> caminhoRelatorio`

**Comportamento OBRIGATÓRIO**

- Auditar o alvo (arquivo/pasta).
- Gerar `relatorio.md` **apenas quando o usuário pedir explicitamente**.
- Salvar `relatorio.md` no contexto da aplicação auditada (mesma regra contextual usada para `PLAN.md`).
- Incluir a pontuação por arquivo e por regra conforme Seções 7.2 e 7.4.

**Saída**

- Caminho do relatório gerado.

---

### 8.2 `criar` (SEM PLANEJAMENTO)

**Assinatura (conceitual)**  
`criar(escopo: descriçãoDaTelaOuComponente, caminhoDestino: string) -> arquivosCriados`

**Comportamento OBRIGATÓRIO**

- **Ignorar planejamento** (não gerar `PLAN.md`, não pedir autorização).
- Criar os arquivos aplicando todas as Regras 1–30.
- **Não** executar `relatorio` automaticamente ao final.

---

### 8.3 `recriar` (SEM PLANEJAMENTO)

**Assinatura (conceitual)**  
`recriar(alvo: caminhoArquivoOuPasta, objetivo: string) -> arquivosAlterados`

**Comportamento OBRIGATÓRIO**

- **Ignorar planejamento** (não gerar `PLAN.md`, não pedir autorização).
- Refatorar/reestruturar para cumprir Regras 1–30.
- **Não** executar `relatorio` automaticamente ao final.

---
