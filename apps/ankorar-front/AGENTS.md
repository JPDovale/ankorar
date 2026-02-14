# AGENTS

Documentação obrigatória para continuidade entre chats:

- Padrão de requisições API: [`docs/API_REQUEST_PATTERN.md`](docs/API_REQUEST_PATTERN.md)
- Padrão de criação de hooks: [`docs/HOOK_PATTERN.md`](docs/HOOK_PATTERN.md)
- Padrão de formulários: [`docs/FORM_PATTERN.md`](docs/FORM_PATTERN.md)
- Padrão de interface (Linear/Vercel): [`docs/UI_STYLE_GUIDE.md`](docs/UI_STYLE_GUIDE.md)
- Regra de gatilho: ao receber prompts iniciando com `ui:`, seguir estritamente as regras de construção de UI descritas em [`docs/UI_STYLE_GUIDE.md`](docs/UI_STYLE_GUIDE.md).
- Arquitetura visual de referência para `ui:`: interpretar e aplicar estritamente o estilo Vercel/Linear/Notion descrito em [`docs/UI_STYLE_GUIDE.md`](docs/UI_STYLE_GUIDE.md).
- Padrão de interface: usar componentes `shadcn/ui` (ou derivados locais em `src/components/ui`) para construir a UI; não usar `window.alert`, `window.confirm` ou `window.prompt`.

Antes de criar/alterar integrações HTTP e hooks de domínio, siga esses documentos.
