---
name: back-end-developer-fastify
description: Skill normativa para criação, recriação e refatoração de back-end com Fastify, com fluxo bloqueante de planejamento/autorização, auditoria pontuada e relatório sob demanda. Use quando for necessário implementar ou revisar rotas, plugins, serviços, schemas e integrações HTTP em projetos Fastify.
---

# Skill: Back-end Quality Gate (Fastify) — `back-end-developer-fastify-v1`

## 1. Objetivo

Estabelecer uma skill normativa e auditável para **criação, recriação e refatoração de back-end Fastify**, garantindo consistência arquitetural, separação por camadas, contratos previsíveis e disciplina operacional, com **pontuação por regras** e **auditoria pós-entrega**.

---

## 2. Escopo

Esta skill se aplica a:

- Servidores Fastify, rotas, handlers, plugins, hooks e middlewares.
- Schemas de validação/serialização, contratos HTTP, tratamento de erro e códigos de status.
- Camadas de domínio, dados e infraestrutura associadas ao fluxo HTTP.
- Refatoração estrutural para remover acoplamento entre HTTP, domínio, dados e infra.

Fora de escopo:

- Front-end/UI.
- Infra de deploy/CI/CD (exceto quando necessário para remover side-effects indevidos do código de aplicação).
- Redesign completo de domínio sem solicitação explícita.

---

## 3. Definições e Convenções Normativas

### 3.1 Termos Normativos (RFC 2119)

- **DEVE / OBRIGATÓRIO**: requisito mandatário.
- **NÃO DEVE / PROIBIDO**: requisito que não pode ocorrer.
- **RECOMENDADO**: deve ser seguido, salvo justificativa técnica explícita.
- **OPCIONAL**: pode ser aplicado quando fizer sentido.

### 3.2 Definições Operacionais

- **HTTP Layer**: definição de rotas, handlers, schemas, status codes e serialização.
- **Domain Logic**: regras de negócio, invariantes e orquestração de casos de uso.
- **Data Layer**: acesso a banco/API externa, repositórios e gateways.
- **Infra Layer**: plugins, clients, adapters, observabilidade e recursos de runtime.
- **Estado de fluxo**: sucesso, erro de validação, erro de domínio, erro de infraestrutura.

### 3.3 Convenções de Estrutura (padrão sugerido)

- `src/http/**` (routes, handlers, schemas)
- `src/domain/**` (use-cases, entidades, regras)
- `src/data/**` (repositories, queries, mappers)
- `src/infra/**` (clients, adapters, providers)
- `src/plugins/**` (plugins Fastify)

> Observação: a estrutura acima é RECOMENDADA. As regras normativas abaixo são OBRIGATÓRIAS independentemente da árvore.

### 3.4 Equivalência Terminológica (OBRIGATÓRIA)

- **Auditoria** e **Relatório** são o mesmo artefato lógico.
- No contexto desta skill:
  - **Auditar** = avaliar regras e pontuar arquivos.
  - **Gerar relatório** = materializar a auditoria em `relatorio.md`.
- A estrutura da auditoria **DEVE** ser idêntica no planejamento (`PLAN.md`) e no `relatorio.md`.

---

## 4. Regras

### Regra 1 — Responsabilidade Única por Arquivo (penalidade: -4)

**Definição formal**  
Todo arquivo **DEVE** possuir responsabilidade única, ser curto e fácil de ler.  
Arquivos **NÃO DEVEM** exportar, nem declarar, mais de uma função na raiz do arquivo.

**Escopo de aplicação**  
Todos os arquivos de código do back-end.

**Critérios verificáveis**

- O arquivo mantém uma responsabilidade principal clara.
- Existe no máximo uma função na raiz do arquivo.
- O conteúdo permanece enxuto e legível, sem acúmulo de responsabilidades.

**Validação**

- Detectar duas ou mais funções na raiz do arquivo => violação.
- Detectar mistura de responsabilidades (ex.: HTTP + domínio + dados no mesmo arquivo sem necessidade) => violação.
- Detectar arquivo extenso e difícil de leitura por falta de extração => violação.

**Impacto na pontuação**

- Violação: reduzir 4 pontos no arquivo afetado.

---

### Regra 2 — Arquivos `Module` como Centralização sem Lógica (penalidade: -7)

**Definição formal**  
Todo arquivo com terminação `Module` **DEVE** centralizar funções e ações do módulo/entidade correspondente.  
Arquivos `Module` **NÃO DEVEM** implementar lógica no corpo principal; a implementação **DEVE** ser abstraída em arquivos espelhados na pasta do módulo.

**Escopo de aplicação**  
Todos os arquivos com terminação `Module`.

**Critérios verificáveis**

- O `Module` apenas centraliza, delega e exporta responsabilidades.
- Não há implementação de função no corpo principal do `Module`.
- Implementações estão em arquivos espelhados do módulo (ex.: `models/user/createUser.ts`, `models/user/fns/persistUser.ts`).

**Validação**

- Detectar implementação inline de função no arquivo `Module` => violação.
- Detectar ausência de arquivo espelhado para lógica extraída quando necessário => violação.

**Resolução obrigatória**

- Extrair implementações do arquivo `Module` para arquivos espelhados da entidade.
- Manter o `Module` somente como ponto de centralização, composição e exportação.

**Impacto na pontuação**

- Violação: reduzir 7 pontos no arquivo afetado.

---

### Regra 3 — Entidades em `Module` com Nome do Banco (penalidade: -3)

**Definição formal**  
Toda entidade **DEVE** estar na pasta de `Module` e **DEVE** replicar o nome existente no banco de dados.

**Escopo de aplicação**  
Entidades e estruturas de modelagem relacionadas.

**Critérios verificáveis**

- A entidade está organizada na pasta de `Module`.
- O nome da entidade corresponde ao nome adotado no banco.
- Não há alias divergente entre entidade e estrutura persistida.

**Validação**

- Detectar entidade fora da pasta de `Module` => violação.
- Detectar divergência de nome entre entidade e banco => violação.

**Impacto na pontuação**

- Violação: reduzir 3 pontos no arquivo afetado.

---

### Regra 4 — Raiz do Module Apenas para Exportação das Regras de Negócio (penalidade: -5)

**Definição formal**  
A raiz do `Module` **DEVE** expor funções de regra de negócio apenas por referência/exportação.  
Implementações de regra de negócio **NÃO DEVEM** ficar inline no `Module`; **DEVEM** ser movidas para arquivos espelhados da pasta do módulo.  
Toda função auxiliar **DEVE** ficar em `fns`.

**Escopo de aplicação**  
Arquivos e estruturas de `Module` e seu espelho de funções auxiliares.

**Critérios verificáveis**

- A raiz do módulo expõe regras de negócio somente via import/referência/exportação.
- Implementações de regra de negócio estão em arquivos espelhados do módulo.
- Funções auxiliares técnicas/de suporte ficam no namespace `fns`.

**Validação**

- Detectar implementação inline de regra de negócio na raiz do `Module` => violação.
- Detectar função auxiliar fora de `fns` => violação.
- Detectar raiz do módulo com função auxiliar utilitária => violação.

**Resolução obrigatória**

- Manter regras de negócio na raiz apenas como exportação/referência.
- Mover implementação de regra de negócio para arquivos espelhados do módulo.
- Mover funções auxiliares para `fns`.

**Impacto na pontuação**

- Violação: reduzir 5 pontos no arquivo afetado.

---

### Regra 5 — Tipagem de Props/Resposta por Função e `typeof` no Module (penalidade: -4)

**Definição formal**  
Cada função auxiliar ou de regra de negócio **DEVE** declarar no topo do arquivo:
- uma tipagem de propriedades de entrada;
- uma tipagem de resposta.

A tipagem de funções no `Module` **DEVE** usar `typeof` das referências importadas, evitando assinatura manual duplicada.
Arquivos `Module` **NÃO DEVEM** exportar tipagens (`type`/`interface`).

**Escopo de aplicação**  
Arquivos de funções espelhadas do módulo (incluindo `fns`) e tipagens estruturais do arquivo `Module`.

**Critérios verificáveis**

- O arquivo de função declara os tipos de entrada e resposta no topo.
- A assinatura da função utiliza esses tipos explicitamente.
- A tipagem do `Module` referencia as referências importadas com `typeof`.
- O arquivo `Module` não possui export de `type` ou `interface`.

**Validação**

- Detectar arquivo de função sem tipagem de entrada no topo => violação.
- Detectar arquivo de função sem tipagem de resposta no topo => violação.
- Detectar tipagem manual de função no `Module` quando a referência já é importada => violação.
- Detectar `export type` ou `export interface` em arquivo `Module` => violação.

**Resolução obrigatória**

- Criar tipagem de entrada e tipagem de resposta no topo do arquivo de função.
- Aplicar as tipagens na assinatura da função.
- Substituir assinaturas manuais no `Module` por `typeof <referenciaImportada>`.
- Remover export de tipagens dos arquivos `Module`, mantendo tipagem local não exportada quando necessário.

**Impacto na pontuação**

- Violação: reduzir 4 pontos no arquivo afetado.

---

### Regra 6 — Espelhamento por Entidade com `index.ts` e `typeof` da Constante (penalidade: -5)

**Definição formal**  
O espelhamento de pastas **DEVE** acompanhar as entidades expostas no `Module`.  
Se o `Module` expõe uma entidade (ex.: `Auth`), **DEVE** existir uma pasta espelhada da entidade (ex.: `Auth`).  
As entidades e implementações associadas **DEVEM** ser movidas para a pasta espelhada da própria entidade.  
O arquivo de entidade **DEVE** existir dentro da pasta espelhada da entidade (ex.: `models/user/User.ts` **DEVE** ser movido para `models/user/Users/User.ts` quando a entidade exposta no `Module` for `Users`).  
Cada pasta de entidade **DEVE** ter um `index.ts` exportando uma constante da entidade, e essa constante **DEVE** ser implantada no `Module`.  
A tipagem do `Module` para a entidade **DEVE** usar `typeof` da constante exportada no `index.ts`.

**Escopo de aplicação**  
Arquivos `Module` e estrutura de pastas espelhadas por entidade dentro do contexto do módulo.

**Critérios verificáveis**

- Cada entidade exposta no `Module` possui pasta espelhada com o mesmo nome.
- Entidades e implementações relacionadas estão fisicamente na pasta espelhada da entidade.
- O arquivo da entidade está fisicamente dentro da pasta espelhada da entidade.
- A pasta da entidade possui `index.ts` exportando a constante da entidade.
- O `Module` importa e implanta essa constante na composição da entidade.
- A tipagem do `Module` referencia `typeof <ConstanteDaEntidade>`.

**Validação**

- Detectar entidade no `Module` sem pasta espelhada correspondente => violação.
- Detectar entidade/implementação mantida fora da pasta espelhada correspondente => violação.
- Detectar arquivo de entidade fora da pasta espelhada (ex.: `models/user/User.ts`) => violação.
- Detectar pasta de entidade sem `index.ts` exportando constante => violação.
- Detectar entidade implantada no `Module` sem uso da constante exportada => violação.
- Detectar tipagem manual da entidade no `Module` em vez de `typeof <ConstanteDaEntidade>` => violação.

**Resolução obrigatória**

- Criar pasta espelhada para cada entidade exposta no `Module`.
- Mover entidade e implementações relacionadas para a pasta espelhada correspondente.
- Mover arquivo de entidade para a pasta espelhada (ex.: `models/user/User.ts` -> `models/user/Users/User.ts`).
- Criar `index.ts` na pasta da entidade exportando a constante da entidade.
- Implantar a constante exportada no `Module`.
- Substituir tipagem manual da entidade no `Module` por `typeof <ConstanteDaEntidade>`.

**Impacto na pontuação**

- Violação: reduzir 5 pontos no arquivo afetado.

---

### Regra 7 — Entidade Base e Mapeamento de Retorno para Entity/ValueObject (penalidade: -4)

**Definição formal**  
Toda entidade **DEVE** extender a classe `Entity`.  
Todo retorno vindo do banco **DEVE** ser mapeado para alguma entidade.  
Quando o retorno envolver junção de mais de uma entidade, o mapeamento **DEVE** resultar em um `ValueObject` com nome consistente.
`ValueObject` **DEVE** ficar no mesmo nível de pasta das entidades no contexto espelhado do módulo.

Como padrão de nomenclatura, **RECOMENDA-SE** o uso de:
- `<Entidade>` para Entity;
- `<Entidade>Details` para `ValueObject` detalhado;
- `<Entidade>Preview` para `ValueObject` resumido.

**Escopo de aplicação**  
Entidades, mapeadores, consultas e fluxos que consomem retorno de banco.

**Critérios verificáveis**

- Classes de entidade extendem `Entity`.
- Retornos de banco não são propagados como objeto cru; passam por mapeamento para Entity ou `ValueObject`.
- Retornos com junção de múltiplas entidades usam `ValueObject` nomeado de forma consistente (ex.: `Details`/`Preview`).
- `ValueObject` está no mesmo nível das entidades dentro da pasta espelhada (ex.: `models/library/Libraries/Library.ts` e `models/library/Libraries/LibraryDetails.ts`).

**Validação**

- Detectar entidade que não extende `Entity` => violação.
- Detectar retorno de banco cru sem mapeamento para Entity/`ValueObject` => violação.
- Detectar junção de múltiplas entidades sem `ValueObject` consistente => violação.
- Detectar `ValueObject` fora do mesmo nível de pasta das entidades => violação.

**Resolução obrigatória**

- Garantir que toda entidade extenda `Entity`.
- Mapear cada retorno de banco para Entity ou `ValueObject`.
- Em junções, criar `ValueObject` consistente (preferencialmente `Details` ou `Preview`) e mapear explicitamente para ele.
- Mover `ValueObject` para o mesmo nível de pasta das entidades na estrutura espelhada do módulo.

**Impacto na pontuação**

- Violação: reduzir 4 pontos no arquivo afetado.

---

### Regra 8 — Proibição de Re-exports e Migração Sem Compatibilidade Legada (penalidade: -4)

**Definição formal**  
Arquivos **NÃO DEVEM** usar re-exports como padrão de organização (`export * from`, `export { X } from`, barrels agregadores).  
Cada arquivo **DEVE** importar diretamente o que precisa da origem canônica.  
Em refatorações, o objetivo **DEVE** ser migrar todos os consumidores para o novo padrão, sem manter camada de compatibilidade com o padrão antigo.

**Escopo de aplicação**  
Arquivos de módulo, entidades, funções, `index.ts` e demais pontos de composição/consumo no back-end.

**Critérios verificáveis**

- Não há `export * from` ou re-export de símbolos de terceiros para simples repasse.
- Consumidores importam diretamente do arquivo fonte responsável.
- Refatorações removem pontos de compatibilidade legada (bridges/barrels antigos) ao concluir a migração.

**Validação**

- Detectar `export * from` => violação.
- Detectar `export { X } from "./algum-arquivo"` usado como repasse arquitetural => violação.
- Detectar manutenção de camada de compatibilidade com padrão antigo após refatoração => violação.

**Resolução obrigatória**

- Remover re-exports de repasse e barrel files de agregação.
- Atualizar imports para origem canônica de cada dependência.
- Em refatorações, migrar consumidores para o novo padrão e remover compatibilidade legada residual.

**Impacto na pontuação**

- Violação: reduzir 4 pontos no arquivo afetado.

---

### Regras Complementares (quando fornecidas no contexto)

- Além das Regras 1-8, o agente **PODE** receber regras complementares da tarefa.
- Regras complementares **DEVEM** incluir no mínimo:
  - `id`
  - `nome`
  - `penalidade`
  - critério verificável de violação
- Na ausência de regras complementares, aplicar apenas as Regras 1-8.

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
   1. Refatorar fronteiras arquiteturais (HTTP, domínio, dados e infra).
   2. Refatorar estrutura, tamanho, legibilidade e remoção de código morto.
   3. Refatorar contratos de entrada/saída, validações, erros e consistência de respostas.
   4. Refatorar observabilidade, resiliência, performance e segurança conforme escopo.
8. Reavaliar internamente os arquivos alterados.
9. Gerar `relatorio.md` **apenas se** o usuário solicitar explicitamente.
10. Ao concluir a aplicação das alterações, **apagar** o `PLAN.md` da aplicação alvo.
11. Se não for possível apagar `PLAN.md`, informar explicitamente o erro e não concluir o fluxo como finalizado.

### 6.2 Execução Determinística — Fluxo `criar`/`recriar` (sem planejamento)

1. Identificar o escopo solicitado (feature/componente/fluxo HTTP).
2. Definir boundaries de HTTP vs domínio vs dados vs infra.
3. Implementar tratamento explícito de sucesso/erro de validação/erro de domínio/erro de infra.
4. Garantir contratos previsíveis de request/response (schemas, status code, serialização).
5. Aplicar consistência estrutural e remover código morto.
6. Garantir isolamento de side-effects em camadas apropriadas.
7. Rodar auditoria pós-entrega apenas internamente.
8. Gerar `relatorio.md` **somente** mediante solicitação explícita do usuário.

---

## 7. Auditoria Pós-Entrega

### 7.1 Regras de Pontuação

- Pontuação inicial por arquivo: **10**.
- Para cada regra violada no arquivo, subtrair a **penalidade** correspondente nas Regras 1-8 e nas complementares (quando houver).
- Pontuação final mínima RECOMENDADA: **≥ 9** por arquivo (salvo justificativa técnica explícita no relatório).
- O arquivo `relatorio.md` só é materializado quando o usuário solicitar explicitamente.

### 7.2 Formato OBRIGATÓRIO do Relatório

Para cada arquivo auditado, a auditoria/relatório **DEVE** incluir:

- Pontuação inicial: 10
- Lista **completa** das Regras 1-8 e das regras complementares fornecidas no contexto (quando houver), cada uma com:
  - regra (id + nome)
  - penalidade
  - redução aplicada (inclusive 0)
  - evidência objetiva (trecho/descrição curta)
- Pontuação final
- Ações recomendadas (se pontuação < alvo)

### 7.3 Algoritmo de Auditoria (determinístico)

1. Para cada arquivo:
   - score = 10
2. Para cada regra base (1-8) e para cada regra complementar (quando houver):
   - se violação detectada: score -= penalidade(regra)
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
| R1 - Responsabilidade Única por Arquivo | -4 | 0 | ... | 10 |
| R2 - Arquivos `Module` como Centralização sem Lógica | -7 | 0 | ... | 10 |
| R3 - Entidades em `Module` com Nome do Banco | -3 | 0 | ... | 10 |
| R4 - Raiz do Module Apenas para Exportação das Regras de Negócio | -5 | 0 | ... | 10 |
| R5 - Tipagem de Props/Resposta por Função e `typeof` no Module | -4 | 0 | ... | 10 |
| R6 - Espelhamento por Entidade com `index.ts` e `typeof` da Constante | -5 | 0 | ... | 10 |
| R7 - Entidade Base e Mapeamento de Retorno para Entity/ValueObject | -4 | 0 | ... | 10 |
| R8 - Proibição de Re-exports e Migração Sem Compatibilidade Legada | -4 | 0 | ... | 10 |
| R<id-extra> - <nome-da-regra-complementar> | -<penalidade> | 0 | ... | ... |

Pontuação final: <score>/10
Ações recomendadas:
- <ação 1>
- <ação 2>
```

- A lista de regras **NÃO DEVE** ser parcial.
- A lista **SEMPRE DEVE** incluir R1-R8, mesmo sem violações.
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

- Auditar o alvo (arquivo/pasta) pelas Regras 1-8.
- Incluir regras complementares somente quando fornecidas no contexto.
- Se o contexto exigir regras complementares e elas não estiverem disponíveis, solicitar antes de gerar a auditoria materializada.
- Gerar `relatorio.md` **apenas quando o usuário pedir explicitamente**.
- Salvar `relatorio.md` no contexto da aplicação auditada (mesma regra contextual usada para `PLAN.md`).
- Incluir a pontuação por arquivo e por regra conforme Seções 7.2 e 7.4.

**Saída**

- Caminho do relatório gerado.

---

### 8.2 `criar` (SEM PLANEJAMENTO)

**Assinatura (conceitual)**  
`criar(escopo: descricaoDaFeatureOuComponente, caminhoDestino: string) -> arquivosCriados`

**Comportamento OBRIGATÓRIO**

- **Ignorar planejamento** (não gerar `PLAN.md`, não pedir autorização).
- Criar os arquivos aplicando as Regras 1-8 e as complementares (quando fornecidas no contexto da tarefa).
- **Não** executar `relatorio` automaticamente ao final.

---

### 8.3 `recriar` (SEM PLANEJAMENTO)

**Assinatura (conceitual)**  
`recriar(alvo: caminhoArquivoOuPasta, objetivo: string) -> arquivosAlterados`

**Comportamento OBRIGATÓRIO**

- **Ignorar planejamento** (não gerar `PLAN.md`, não pedir autorização).
- Refatorar/reestruturar aplicando as Regras 1-8 e as complementares (quando fornecidas no contexto da tarefa).
- **Não** executar `relatorio` automaticamente ao final.

---
