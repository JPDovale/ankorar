import swc from "unplugin-swc";
import { configDefaults, defineConfig } from "vitest/config";
import tsConfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  test: {
    testTimeout: 60000,
    hookTimeout: 60000,
    include: ["**/*.e2e.spec.ts"],
    fileParallelism: false,
    maxWorkers: 1,
    maxConcurrency: 1,
    globals: true,
    root: "./",
    exclude: [...configDefaults.exclude, "**/database/pg/**"],
    isolate: false,
    setupFiles: ["./test/setup.ts"],
  },
  plugins: [
    tsConfigPaths(),
    swc.vite({
      module: { type: "es6" },
    }),
  ],
});
