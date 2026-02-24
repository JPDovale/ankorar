# Build de produção usando @ankorar/nodex do npm

Por padrão, no monorepo os apps (ex.: ankorar-front) usam o pacote **local** via `workspace:*` tanto em dev quanto no build. Assim o deploy usa o mesmo código que está no repositório.

Se quiser que o **build de produção** use a versão **publicada no npm** (em vez do workspace):

1. No comando de **install** do seu pipeline (Vercel, Docker, etc.), rode antes do `pnpm install`:
   ```bash
   node scripts/use-published-nodex.js && pnpm install --frozen-lockfile
   ```
2. O script consulta o registry e define `pnpm.overrides["@ankorar/nodex"]` para a última versão publicada, então o `pnpm install` resolve o pacote pelo npm.

**Resumo:**
- **Dev**: sempre workspace (pacote local).
- **Prod (padrão)**: workspace (build no monorepo usa o local).
- **Prod (opcional)**: use `use-published-nodex.js` no install para forçar a versão do npm.
