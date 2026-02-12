# Form Pattern (Frontend)

Este documento define o padrão obrigatório para páginas com formulário no `ankorar-front`.

## Regras

1. Toda página com formulário deve usar `react-hook-form`.
2. Toda validação de formulário deve usar `zod` com `zodResolver`.
3. Erros de validação devem gerar `toast` na submissão inválida.
4. Campos podem exibir erro inline, mas o `toast` é obrigatório.
5. A submissão deve usar ações de hook de domínio (ex.: `useUser`), não `connection` direto.
6. Fluxo de erro de API continua no hook de domínio (toast no hook, sem `try/catch` na página).

## Exemplo base

```tsx
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  mode: "onSubmit",
});

function onInvalidSubmit() {
  const firstErrorMessage = Object.values(form.formState.errors)[0]?.message;
  toast.error(firstErrorMessage ?? "Verifique os dados do formulário.");
}

<form onSubmit={form.handleSubmit(onValidSubmit, onInvalidSubmit)} />
```

## Dependências padrão

- `react-hook-form`
- `zod`
- `@hookform/resolvers`
