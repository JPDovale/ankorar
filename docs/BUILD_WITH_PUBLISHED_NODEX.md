# Build de produção usando @ankorar/nodex do npm

Por padrão, no monorepo os apps (ex.: ankorar-front) usam o pacote **local** via `workspace:*` tanto em dev quanto no build. Assim o deploy usa o mesmo código que está no repositório.

Se quiser que o **build de produção** use a versão **publicada no npm** (em vez do workspace):

1. No comando de **install** do pipeline (Vercel, Docker, etc.), use **apenas**:
   ```bash
   node scripts/use-published-nodex.js
   ```
   (rode na **raiz do monorepo**.) O script aplica o override e já roda `pnpm install` internamente (sem `--frozen-lockfile`). **Não** use `pnpm install --frozen-lockfile` no mesmo passo.
2. O script consulta o registry, define `pnpm.overrides["@ankorar/nodex"]` e atualiza o lockfile; o build usa o pacote do npm.

**Resumo:**
- **Dev**: sempre workspace (pacote local).
- **Prod (padrão)**: workspace (build no monorepo usa o local).
- **Prod (opcional)**: use `use-published-nodex.js` no install para forçar a versão do npm.
