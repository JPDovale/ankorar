#!/usr/bin/env node
/**
 * Opcional: use a versão publicada de @ankorar/nodex no npm em vez do workspace.
 * Útil no build de produção (ex.: Vercel) quando quiser que os apps usem o pacote publicado.
 *
 * Uso: na raiz do monorepo: node scripts/use-published-nodex.js
 *
 * O script aplica o override, depois roda "pnpm install" na raiz (sem
 * --frozen-lockfile) para atualizar o lockfile. Em CI/Vercel use só este
 * comando no Install (não use --frozen-lockfile).
 *
 * Não commite o package.json nem o pnpm-lock.yaml após rodar localmente.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.join(__dirname, "..");
const rootPackagePath = path.join(rootDir, "package.json");

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
  console.log("Rodando pnpm install na raiz (--no-frozen-lockfile)...");
  execSync("pnpm install --no-frozen-lockfile", { cwd: rootDir, stdio: "inherit" });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
