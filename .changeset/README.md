# Changesets

Os changesets são usados para controle de versão e changelog no monorepo.

## Fluxo

1. **Criar um changeset** após alterações que merecem release:
   ```bash
   pnpm changeset
   ```
   Escolha o pacote (ex.: `@ankorar/nodex`), o tipo de bump (major / minor / patch) e descreva a mudança. Um arquivo em `.changeset/` será criado.

2. **Commit** do changeset junto com suas alterações:
   ```bash
   git add .changeset/*.md
   git commit -m "feat(nodex): ..."
   ```

3. **Aplicar changesets e atualizar versões** (antes de publicar ou em CI):
   ```bash
   pnpm version
   ```
   Isso consome os arquivos em `.changeset/`, atualiza `package.json` e gera/atualiza o CHANGELOG. Depois faça commit das alterações de versão e changelog.

4. **Publicar** é feito pela GitHub Action no push para `main`: se houver changesets, a action abre o PR "chore: version packages"; ao fazer merge desse PR, a action aplica as versões e publica no npm (`pnpm run release`).

## Documentação

- [Changesets](https://github.com/changesets/changesets)
- [Using Changesets with pnpm](https://pnpm.io/using-changesets)
