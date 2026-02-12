# Hook Pattern (Frontend)

Este documento define o padrão obrigatório para criação de hooks de domínio no `ankorar-front`.

## Objetivo

Centralizar query/mutation por domínio, reduzir lógica repetida em páginas e manter DX consistente.

## Regras

1. Um hook de domínio deve centralizar estado, query e mutations do domínio (ex.: `useUser`).
2. Páginas e componentes não devem chamar `useMutation` diretamente para fluxos de domínio já centralizados.
3. O hook deve expor ações executáveis com retorno explícito de resultado:
   - `const { success } = await action(payload)`
4. Não usar callbacks como API principal da ação.
5. Não usar `try/catch` em páginas para fluxo de API.
6. Erros de API devem ser tratados no hook via `toast` (usando `response.error.message`).
7. Ações do hook não devem lançar `throw` para erros esperados de API; devem retornar `{ success: false }`.
8. Para erros inesperados (runtime/rede), o hook exibe `toast` e retorna falha.
9. O hook deve expor flags de loading por ação (`isLoggingIn`, `isCreatingUser`, etc.).
10. Para validação de formulário em página, seguir `docs/FORM_PATTERN.md`.
11. Evitar prop drilling de recursos globais (ex.: usuário autenticado): componentes devem consumir o hook de domínio diretamente quando possível.

## Exemplo de uso em página

```tsx
const { login, isLoggingIn } = useUser();

const { success } = await login({
  email: email.trim(),
  password: password.trim(),
});

if (!success) return;

// sucesso
```

## Estrutura recomendada

- Requests HTTP: `src/services/<dominio>/*Request.ts`
- Hook de domínio: `src/hooks/use<Domain>.tsx`
- Página/componentes: apenas consomem o hook

## Checklist

- [ ] O hook centraliza query + mutations do domínio?
- [ ] A página usa `await action(payload)` inline?
- [ ] O retorno da ação inclui `success` explícito?
- [ ] Não há `try/catch` em página para erro de API?
- [ ] O toast de erro está no hook?
- [ ] Dados globais (como usuário) não estão sendo propagados por props sem necessidade?
