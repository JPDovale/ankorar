#!/usr/bin/env node
/**
 * Opcional: use a versão publicada de @ankorar/nodex no npm em vez do workspace.
 * Útil no build de produção (ex.: Vercel) quando quiser que os apps usem o pacote publicado.
 *
 * Uso: node scripts/use-published-nodex.js
 * Depois: pnpm install --frozen-lockfile (ou seu comando de install).
 *
 * O script adiciona pnpm.overrides["@ankorar/nodex"] com a última versão do npm
 * no package.json da raiz. Não commite o package.json após rodar localmente;
 * em CI use apenas no comando de install (ex.: node scripts/use-published-nodex.js && pnpm install).
 */

const fs = require("fs");
const path = require("path");

const rootPackagePath = path.join(__dirname, "..", "package.json");

async function getPublishedVersion() {
  const res = await fetch("https://registry.npmjs.org/@ankorar/nodex/latest");
  if (!res.ok) {
    throw new Error(
      `Falha ao obter versão do npm: ${res.status} ${res.statusText}. O pacote já foi publicado?`
    );
  }
  const data = await res.json();
  return data.version;
}

async function main() {
  const version = await getPublishedVersion();
  const pkg = JSON.parse(fs.readFileSync(rootPackagePath, "utf8"));
  pkg.pnpm = pkg.pnpm || {};
  pkg.pnpm.overrides = pkg.pnpm.overrides || {};
  pkg.pnpm.overrides["@ankorar/nodex"] = version;
  fs.writeFileSync(rootPackagePath, JSON.stringify(pkg, null, 2) + "\n");
  console.log(`Override @ankorar/nodex -> ${version}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
