# UI Style Guide (Frontend)

Este documento define o padrão visual obrigatório da interface no `ankorar-front`.

## Direção visual

A interface deve seguir referências de produto como Vercel, Linear e Notion:

1. Estética minimalista, foco em clareza e densidade de informação.
2. Layout com hierarquia limpa, sem excesso de elementos decorativos.
3. Paleta neutra (zinc/gray) com uso pontual de cor para ações e estados.
4. Contraste alto para conteúdo principal e contraste suave para elementos secundários.
5. Bordas, sombras e transições discretas.

## Referências visuais (interpretação obrigatória)

1. Vercel:
   - superfícies limpas e discretas,
   - foco em contraste e precisão tipográfica,
   - destaque visual por estrutura, não por decoração.
2. Linear:
   - alta densidade de informação com leitura rápida,
   - estados ativos e interações bem definidos,
   - microinterações sutis, sem ruído.
3. Notion:
   - organização por blocos simples e previsíveis,
   - legibilidade acima de estética chamativa,
   - linguagem visual calma e funcional.

## Tokens base

1. Fundo da aplicação: `zinc-100/80`.
2. Superfícies principais: `bg-white` com `border-zinc-200/80`.
3. Raio principal: `rounded-2xl` em shells e contêineres de alto nível.
4. Sombras:
   - shell/containers: `shadow-[0_1px_2px_rgba(16,24,40,0.06)]`.
   - elementos menores: `shadow-sm`.
5. Espaçamento do shell: `p-2` externo e `gap-2` entre regiões principais.
6. Transições: `150ms` a `250ms`.

## Regras de implementação gerais

1. Priorizar componentes `shadcn/ui` (ou derivados locais em `src/components/ui`).
2. Evitar banners hero com gradientes chamativos em telas de listagem; preferir headers compactos.
3. Tipografia:
   - títulos curtos e diretos,
   - descrições em texto secundário,
   - evitar blocos longos sem necessidade.
4. Interações:
   - hover/focus com feedback sutil,
   - transições curtas (`150ms` a `250ms`),
   - não usar animações excessivas.

## Regra de gatilho `ui:`

1. Sempre que o pedido do usuário começar com `ui:`, esta documentação deve ser aplicada de forma estrita.
2. Nesse caso:
   - não improvisar padrões fora deste guia,
   - manter consistência integral com os princípios Vercel/Linear/Notion,
   - priorizar decisões que reforcem clareza, densidade e legibilidade.

## Arquitetura de UI de referência (Vercel/Linear/Notion)

### 1. Modelo mental do produto

1. Vercel: interface enxuta, alto contraste sem excesso de ornamento, foco em hierarquia por layout.
2. Linear: produto orientado a produtividade, densidade de informação alta, estados e navegação muito claros.
3. Notion: blocos previsíveis e composição modular, leitura calma, neutralidade visual.
4. Resultado esperado no Ankorar: um shell estável de workspace, com baixa fricção visual e alta legibilidade operacional.

### 2. Arquitetura de camadas de UI (React)

1. Camada de primitives:
   - componentes base em `src/components/ui` (`Button`, `Card`, `Popover`, `Dialog`, etc.),
   - sem regra de negócio de domínio.
2. Camada de padrões de composição:
   - estruturas reutilizáveis como shell, headers de listagem, empty states e seções de cards,
   - usa primitives para impor consistência visual e de espaçamento.
3. Camada de domínio:
   - componentes de domínio em `src/components/<dominio>` e páginas em `src/pages`,
   - consome hooks de domínio (`useMaps`, `useLibraries`, `useOrganizations`, `useUser`).
4. Camada de dados:
   - requests HTTP em `src/services/<dominio>/*Request.ts`,
   - orquestração de estado assíncrono em hooks (React Query), nunca direto na página.

### 3. Estrutura de código recomendada

```txt
src/
  components/
    ui/                     # primitives e componentes base
    SideBar/                # padrão de navegação global
    Header/                 # padrão de topo do workspace
  hooks/
    use<Domain>.tsx         # estado de servidor + mutations por domínio
  pages/
    <page>.tsx              # composição de layout e fluxo de tela
  services/
    <domain>/*Request.ts    # cliente HTTP tipado e isolado
```

### 4. Gestão de estado (boas práticas React)

1. Estado de servidor:
   - manter em hooks de domínio com React Query,
   - expor `action(payload) -> { success }` e flags de loading.
2. Estado de interface:
   - local (`useState`) para interações efêmeras de componente,
   - global (`zustand`) apenas para estado compartilhado transversal (ex.: sidebar, editor state).
3. Estado de rota:
   - usar URL para estados compartilháveis (`?mode=view`, filtros e paginação quando aplicável).
4. Regra de ouro:
   - páginas compõem fluxo,
   - hooks implementam comportamento,
   - services fazem I/O.

### 5. Sistema de layout (workspace-first)

1. Shell fixo com sidebar e container principal em painéis separados.
2. Header da área principal sempre fixo no topo do container.
3. Rolagem sempre interna no conteúdo (`main`), sem deslocar sidebar.
4. Larguras e espaçamentos guiados por tokens e utilitários já definidos neste guia.

### 6. Sistema de componentes (densidade e consistência)

1. Listagens:
   - header compacto (contexto + título + resumo + ação primária),
   - grid/lista com cards de informação essencial.
2. Ações:
   - ações secundárias em popover com footprint mínimo,
   - ações destrutivas em dialog de confirmação.
3. Empty states:
   - ícone discreto + título curto + descrição objetiva + CTA direto.
4. Navegação:
   - sidebar com labels curtos, sem subtítulo,
   - estado ativo inequívoco.

### 7. Tipografia e copy

1. Títulos curtos e funcionais, orientados ao objeto da tela.
2. Frases de suporte objetivas, sem marketing copy.
3. Linguagem de ação direta: `Criar`, `Vincular`, `Visualizar`, `Excluir`.
4. Evitar mensagens vagas ou decorativas.

### 8. Interação, acessibilidade e ergonomia

1. Todo botão interativo deve ter `aria-label` quando não houver texto explícito.
2. Estados de foco e hover devem ser visíveis e discretos.
3. Respeitar semântica de elementos (`button` para ação, `a` para navegação).
4. Garantir uso confortável em desktop e mobile sem quebra de layout.

### 9. Performance e manutenção

1. Evitar re-render desnecessário por prop drilling; preferir hooks de domínio nos pontos de consumo.
2. Não otimizar prematuramente com `memo` em todo componente; aplicar só em hotspots reais.
3. Manter componentes pequenos e com responsabilidade única.
4. Reaproveitar padrões existentes antes de criar novo componente.

### 10. Anti-padrões proibidos

1. Gradientes e efeitos decorativos em excesso em telas operacionais.
2. Dupla camada de hover/card no mesmo bloco interativo sem necessidade funcional.
3. Misturar chamadas de API diretamente em páginas quando já existe hook de domínio.
4. Usar `window.alert`, `window.confirm` ou `window.prompt`.

## Padrões de construção da interface

### 1. App Shell (obrigatório)

1. A aplicação autenticada deve usar layout flutuante completo:
   - sidebar em um painel próprio,
   - área principal em outro painel, ambos com borda e raio.
2. O shell não deve ser colado nas bordas da viewport.
3. A área principal deve preservar leitura com `max-w` no conteúdo.

### 2. Sidebar (obrigatório)

1. Navegação com foco em label curto; não usar subtítulo/descrição por link.
2. Estado ativo deve ser inequívoco (fundo forte + texto claro).
3. No modo colapsado:
   - mostrar apenas ícones dos links,
   - não duplicar botão de expandir quando já existir no header da página.
4. Footer da sidebar deve mostrar identificação do usuário de forma compacta.

### 3. Header de página de listagem

1. Usar header compacto com:
   - contexto (`Mapas`, `Bibliotecas`),
   - título da tela,
   - resumo curto,
   - ação primária.
2. Evitar conteúdo promocional/decorativo.

### 4. Listas e cards

1. Grid responsivo com densidade estável (sem excesso de whitespace).
2. Cards com informação essencial:
   - título,
   - metadado temporal,
   - ação principal clara.
3. Evitar elementos puramente decorativos que atrapalhem leitura.

### 5. Estados vazios

1. Todo estado vazio deve ter:
   - ícone discreto,
   - título curto,
   - descrição objetiva,
   - CTA contextual.
2. Mensagens devem explicar o próximo passo do usuário.

### 6. Dialogs e ações críticas

1. Confirmar ações destrutivas com `Dialog`.
2. Botão primário deve refletir a ação final (`Criar`, `Vincular`, `Excluir`).
3. Exibir feedback com `toast`; não usar alertas nativos.

## Fluxo de construção de tela

### 1. Receita para páginas autenticadas

1. Estrutura da tela:
   - usar o shell autenticado (sidebar + conteúdo principal flutuantes),
   - manter conteúdo em contêiner `max-w-7xl`.
2. Header da página:
   - contexto curto,
   - título direto,
   - resumo da tela,
   - ação primária.
3. Corpo da página:
   - bloco de `loading`,
   - bloco de `empty state`,
   - bloco de conteúdo com lista/grid.
4. Ações:
   - ações rápidas no card,
   - ações destrutivas em `Dialog`,
   - feedback de sucesso/erro em `toast`.

### 2. Receita para listagens

1. Priorizar leitura:
   - título e metadados sempre visíveis,
   - evitar textos longos.
2. Resposta visual:
   - hover leve,
   - foco legível,
   - estado ativo claro.
3. Performance visual:
   - animações curtas,
   - evitar gradientes pesados e ruído.

### 3. Convenções de copy

1. Títulos curtos e orientados ao objeto (`Listagem de mapas`).
2. Descrições com próxima ação clara (`Crie`, `Vincule`, `Selecione`).
3. Evitar termos vagos e mensagens excessivas.

## Checklist de PR (UI)

- [ ] A tela ficou visualmente limpa e objetiva?
- [ ] O padrão está coerente com referência Linear/Vercel?
- [ ] O shell segue padrão flutuante completo (sidebar + conteúdo)?
- [ ] A sidebar está sem descrições de links e com ativo claro?
- [ ] Existe CTA claro para ação principal?
- [ ] Estados de loading/vazio/erro estão consistentes?
- [ ] Não há uso de `window.alert`, `window.confirm` ou `window.prompt`?
- [ ] O corpo da tela cobre `loading`, `empty` e `content`?
- [ ] As ações críticas estão em `Dialog` com feedback via `toast`?
