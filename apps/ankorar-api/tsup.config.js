import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm", "cjs"],
  outDir: "./build",
  cjsInterop: true,
  minify: false,
  dts: true,
});
