# API Request Pattern (Frontend)

Este documento define o padrão oficial para requisições HTTP no `ankorar-front`.
Use isso como referência obrigatória em novos chats e novas implementações.
Para padrão de criação de hooks, consulte também `docs/HOOK_PATTERN.md`.

## Objetivo

Manter o frontend espelhado na estrutura de controllers do backend (`ankorar-api/src/controllers/**`) e evitar chamadas soltas em componentes/hooks.

## Regras

1. Toda chamada HTTP deve ficar em `src/services/<dominio>/<acao>Request.ts`.
2. O nome do arquivo deve espelhar o controller correspondente no backend.
3. Os arquivos `*Request.ts` devem usar `connection` (`src/services/ankorarApi/axios.ts`) e retornar a resposta crua da API.
4. Componentes e páginas não chamam `connection` diretamente.
5. Componentes/páginas não usam `useMutation` direto para auth; devem usar `useUser` e chamadas inline (`const { success } = await login(payload)`).
6. Tipos de payload/retorno ficam no próprio arquivo `*Request.ts` (não em arquivo global de tipos).
7. Nomenclatura de entidades vindas do backend deve ser curta e explícita:
   - `UserPreview` para retorno resumido
   - `User` para item na íntegra
   - `UserDetails` para item com conexões/relacionamentos
8. Se o backend retornar o item sem sufixo especial, tipar no frontend como item íntegro (ex.: `User`).

## Estrutura Atual (espelhada)

Backend controllers usados no frontend:
- `session/login.ts` -> `POST /v1/sessions`
- `users/create.ts` -> `POST /v1/users`
- `users/getUser.ts` -> `GET /v1/users`

Frontend requests:
- `src/services/session/loginRequest.ts`
- `src/services/users/createUserRequest.ts`
- `src/services/users/getUserRequest.ts`

Exemplo atual de entidade:
- `src/services/users/getUserRequest.ts` exporta `User` (retorno íntegro de `/v1/users`).

Service agregador:
- não utilizado para auth (centralizado no hook)

Hook central de query/mutation:
- `src/hooks/useUser.tsx`

## Como adicionar uma nova rota

Exemplo: backend `controllers/activation/activate.ts` (`PATCH /v1/activations/:token_id`)

1. Criar `src/services/activation/activateRequest.ts`.
2. Implementar chamada HTTP nesse arquivo.
3. Consumir no hook de domínio (ex.: `useActivation` ou `useUser`, conforme contexto).
4. Expor no hook uma função já executável (ex.: `const { success } = await activate(payload)`).
5. Atualizar este documento com o novo mapeamento.

## Decisões importantes do projeto

- Autenticação usa cookies `httpOnly` + `withCredentials: true`.
- Estado de sessão no frontend é gerenciado com `@tanstack/react-query`.
- Tratativa de erro em auth não usa `try/catch` em páginas.
- Erros de API são tratados com `toast` dentro do hook de domínio.
- Funções de hook retornam resultado explícito (`{ success }`) para uso inline.
- Login e cadastro usam o mesmo layout visual (`src/components/auth/AuthScene.tsx`).

## Checklist rápido antes de finalizar mudanças

- [ ] A requisição nova está em `*Request.ts`?
- [ ] O nome está espelhado com o controller backend?
- [ ] Nenhum componente chama `connection` direto?
- [ ] Query/mutation foi centralizada em hook (ex.: `useUser`)?
- [ ] Páginas estão sem `try/catch` para fluxo de auth?
- [ ] Páginas usam retorno inline das ações do hook (`const { success } = await action(payload)`)?
- [ ] Documento atualizado se houve novo endpoint?
