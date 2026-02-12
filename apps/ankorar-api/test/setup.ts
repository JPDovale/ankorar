import { createServerInstance } from "@/src/server";
import { beforeAll } from "vitest";

beforeAll(async () => {
  if (!(globalThis as any).__TEST_SERVER_RUNNING__) {
    const app = createServerInstance({ log: "never" });
    await app.run();
    (globalThis as any).__TEST_SERVER_RUNNING__ = true;
  }
});
